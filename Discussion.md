# NTU Cooler
:::spoiler Table of Content
[toc]
:::
## 登入
仿造hw7
:::info
**Schema**
User:
* string name
* string studentID
* string passwd
* string groupnum
* *string[]class*
:::
## 首頁
* 仿造NTU cool
![](https://i.imgur.com/hyWVwfg.png)
* 左欄只留：首頁(課程內容)、課程資訊、公告、聊天室(整合原本的討論、成員)、成績、文件
* 課程內容
:::info
**Schema**
Syllabus:
* int weeknum
* string outline
* files(or links)
:::
* 待辦事項
    * 只放hw、quiz提醒
## 課程資訊
Syllabus  
顯示Syllabus schema的前兩項
## 公告
:::info
**Schema**
Announcement:
* Date date
* string title
* string content
:::
## 成績
* 加權功能
:::info
**Schema**
Grade:
* string studentID
* string subject
* string HW/Quiz/Exam name
* bool type(HW or Quiz/Exam)
* int score
* float weight
* *bool show*
:::
## 文件
:::info
**Schema**
Files:
* string info (weeknum/HW/Quiz/Exam)
* File files/string link
* string fileName
:::
## 老師端
有一個"新增/更新"的按鈕，按下去長出一個modal
* modal結構：
    * 分兩個tab：add or update
    * 第一個欄位是選單，選擇要新增/更新的欄位 ex.成績/syllabus

## 聊天室
* 側欄隱藏
* 置頂功能
* quiz channel:
    * 學生在回答前不能看其他同學的留言
    * 只有老師可以建立quiz type的channel
    * 老師端新增quiz type的channel->自動加入所有人
    * 老師端可以開啟或關閉quiz channel
* 分多個channel
    * Add channel:
        * 給定chatboName
        * 邀請成員->通知被邀請的人
        * 建立的channel type
        
:::info
**Schema**
Chatbox:
* bool type(一般channel or quiz channel)
* string chatboxName
* string[] notAccess(存還沒回答的人，這些人不能看，回答完就移出去)
* Message[] msgs
* Message pinMsg(存置頂訊息)
    * Message:{string sender, int groupnum, string body, bool hidden}
* string[] participants(群組成員)
:::