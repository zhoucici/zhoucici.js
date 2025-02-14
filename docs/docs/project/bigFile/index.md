---
{
  "title": "大文件上传",
  'description': "大文件上传：分片、md5、webwork、上传策略"
}
---
# 大文件上传
## 前言

在项目开发过程中，经常会遇到大文件上传的场景，在上传大文件时，经常为因为网络原因导致快要上传完的文件重新上传，用户体验特别差，所以这个时候引入了`大文件分片`，分完片之后，上传分片，如果网络波动，也只会影响具体的某一个分片，到时候重新上传就行了。但是对大文件同步分片又会造成页面阻塞，效率低的问题，这个时候引入`webworker`来进行分片加密，切完片直接可以通过`并发上传`最后通知后端合并，完事

## 实现原理

1. WebWorker文件切片：使用webworker将一个大文件分成多个小块（分片）进行上传。
2. 并发上传: 可以使用队列得形式同时上传多个分片，提高速度
3. 错误重试：如果某个分片上传失败，可以单独重试该分片而不需要重新上传整个文件。
4. 合并分片：所有分片上传完成后，通知服务器合并

## 实现逻辑

1. 初始化上传

    * 用户选择要上传的文件
    * 获取文件大小和名称等信息
  
2. 计算分片

    * 根据预设的分片大小计算需要分割的分片数量
    * 使用File.slice()方法切割文件。
    * 使用webworker对文件进行md5计算产生对应的hash值（这里可以拓展，多线程）

3. 分片上传
   
    * 上传分片之前可以先通过分片hash值询问后端是否已经存在对应的分片（续传、秒传）
    * 使用 Ajax（通常是 XMLHttpRequest 或 Fetch API）逐个上传每个分片（可以参考[多请求控制并发：队列](../handQueue)）。
    * 可以设置并发上传的数量，以平衡网络负载。

4. 进度监控
   
    * 监控每一个分片的上传进度，并更新UI显示整体上传进度
  
5. 上传完成
 
    * 所有分片上传成功后，通知服务器进行分片合并。

## 核心代码

这里的代码就不一一展示，具体展示一下计算分片的代码逻辑
```javascript
    // 计算文件hash，分片hash值可为文件hash-{index}
    const { fileHash, fileChunkList } = await this.useWorker(file)
    // 生成文件 hash（web-worker）
    useWorker(file) {
      return new Promise((resolve) => {
        const worker = new Worker(
          new URL('@/worker/hash-worker.js', import.meta.url),
          {
            type: 'module',
          }
        )
        worker.postMessage({ file, chunkSize: this.chunkSize })
        worker.onmessage = (e) => {
          const { fileHash, fileChunkList } = e.data
          if (fileHash) {
            resolve({
              fileHash,
              fileChunkList,
            })
          }
        }
      })
    },

```
hash-worker.js 代码如下

```javascript
import SparkMD5 from './spark-md5.min.js'
// 创建文件切片
function createFileChunk(file, chunkSize) {
  return new Promise((resolve, reject) => {
    let fileChunkList = []
    let cur = 0
    while (cur < file.size) {
      // Blob 接口的 slice() 方法创建并返回一个新的 Blob 对象，该对象包含调用它的 blob 的子集中的数据。
      fileChunkList.push({ chunkFile: file.slice(cur, cur + chunkSize) })
      cur += chunkSize
    }
    // 返回全部文件切片
    resolve(fileChunkList)
  })
}

// 加载并计算文件切片的MD5
async function calculateChunksHash(fileChunkList) {
  // 初始化脚本
  const spark = new SparkMD5.ArrayBuffer()

  // 计算切片进度（拓展功能，可自行添加）
  let percentage = 0
  // 计算切片次数
  let count = 0

  // 递归函数，用于处理文件切片
  async function loadNext(index) {
    if (index >= fileChunkList.length) {
      // 所有切片都已处理完毕
      return spark.end() // 返回最终的MD5值
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(fileChunkList[index].chunkFile)
      reader.onload = (e) => {
        count++
        spark.append(e.target.result)

        // 更新进度并处理下一个切片
        percentage += 100 / fileChunkList.length
        self.postMessage({ percentage }) // 发送进度到主线程

        resolve(loadNext(index + 1)) // 递归调用，处理下一个切片
      }
      reader.onerror = (err) => {
        reject(err) // 如果读取错误，则拒绝Promise
      }
    })
  }

  try {
    // 开始计算切片
    const fileHash = await loadNext(0) // 等待所有切片处理完毕
    self.postMessage({ percentage: 100, fileHash, fileChunkList }) // 发送最终结果到主线程
    self.close() // 关闭Worker
  } catch (err) {
    self.postMessage({ name: 'error', data: err }) // 发送错误到主线程
    self.close() // 关闭Worker
  }
}

// 监听消息
self.addEventListener(
  'message',
  async (e) => {
    try {
      const { file, chunkSize } = e.data
      const fileChunkList = await createFileChunk(file, chunkSize) // 创建文件切片
      await calculateChunksHash(fileChunkList) // 等待计算完成
    } catch (err) {
      // 这里实际上不会捕获到calculateChunksHash中的错误，因为错误已经在Worker内部处理了
      // 但如果未来有其他的异步操作，这里可以捕获到它们
      console.error('worker监听发生错误:', err)
    }
  },
  false
)

// 主线程可以监听 Worker 是否发生错误。如果发生错误，Worker 会触发主线程的error事件。
self.addEventListener('error', function (event) {
  console.log('Worker触发主线程的error事件：', event)
  self.close() // 关闭Worker
})


```
## 总结

大文件上传主要是在于分片，分片就是要利用好webworker，分片同时计算好hash，可以实现续传，秒传的功能。
