# personal_finance（晓财）

”晓财“：一款前端基于React Native后端基于koa的个人记账理财移动端应用（2021年5月）

## 运行截图：

![1](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/1.gif?x-oss-process=image/resize,h_225,w_387)![2](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/2.gif?x-oss-process=image/resize,h_225,w_387)![3](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/3.gif?x-oss-process=image/resize,h_225,w_387)

![4](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/4.gif?x-oss-process=image/resize,h_225,w_387)![5](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/5.gif?x-oss-process=image/resize,h_225,w_387)![6](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/6.gif?x-oss-process=image/resize,h_225,w_387)

![7](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/7.gif?x-oss-process=image/resize,h_225,w_387)![8](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/8.gif?x-oss-process=image/resize,h_225,w_387)![9](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/9.gif?x-oss-process=image/resize,h_225,w_387)

![10](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/10.gif?x-oss-process=image/resize,h_225,w_387)![11](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/12.gif?x-oss-process=image/resize,h_225,w_387)![12](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/12.gif?x-oss-process=image/resize,h_225,w_387)

![13](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/13.gif?x-oss-process=image/resize,h_225,w_387)![14](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/14.gif?x-oss-process=image/resize,h_225,w_387)![15](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/15.gif?x-oss-process=image/resize,h_225,w_387)

![16](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/16.gif?x-oss-process=image/resize,h_225,w_387)![17](https://personal-financ.oss-cn-chengdu.aliyuncs.com/cdn/晓财/17.gif?x-oss-process=image/resize,h_225,w_387)

## 应用总体结构设计
应用是一个IOS端的App，分为以下几个模块，用户模块，打卡模块，账单模块，设置分类模块，图表模块，数据分析模块和预算模块。用户模块的功能有：用户填写基本信息注册，用户登录，用户更换头像，修改用户名，修改性别，修改手机号，修改邮箱，修改密码，退出登录。打卡模块的功能有：每日打卡，显示连续打卡天数，显示记账总天数，显示记账总笔数。账单模块的功能有：记录某笔账单条目，以月为单位查看账单，删除某笔账单条目，修改某笔账单的分类、备注、金额，查看当月总收入和总支出，查看收入、支出排行榜。设置账单分类模块的功能有：添加自定义账单分类，修改自定义分类信息，删除自定义分类并删除对应所有账单条目。图表模块的功能有：以账单类别（收入支出）、记账周期（周月年）进行分组呈现折线图，以及对应的分类排行榜，并可以查看详情。数据分析模块的功能有：将当年的每个月的收入、支出、结余全部列出进行对比，并查看每月的分析报表，做出对应的分析，并建议用户的理财，可视化的饼状图对支出类别进行分析，也可以查看当月支出排行榜。预算模块的功能有：对当月的预算进行设置，可视化的查看当月支出与结余信息。应用整体结构如图：

![应用整体架构图](/Users/mac/Desktop/毕设/应用整体架构图.png)

## 模块设计

应用的主要模块包含：用户模块，打卡模块，账单模块，设置分类模块，图表模块，数据分析模块和预算模块。结构图如图：

![img](file:////private/var/folders/ct/x1wllnn567v1rzpc9tdyb_nc0000gn/T/com.kingsoft.wpsoffice.mac/wps-mac/ksohtml/wpsUx7TrD.jpg) 

### 用户模块

1) 用户注册：用户需要填写用户名（3-16位大小写英文字母和数字组成）、密码（由至少1个小写字母及1个数字的不含空格的6位以上字符组成）、性别、邮箱（example@xxx.com的格式）、手机号（由13、14、15、17或18开头的11位数字组成）即可实现用户的注册。

2) 用户登录：用户注册成功之后，会立即进入登录页面，填写用户名，密码进行登录操作。

3) 修改用户信息：在“我的”页面点击头像进入“用户信息”页面，即可对头像、用户名、性别、手机号及邮箱进行更换或修改，还可以进行退出登录操作。

4) 修改密码：在“用户信息”页面，可以对密码进行修改，修改密码后会自动退出登录，用户需要重新登录应用。

### 打卡模块

1) 每日打卡：用户每天都可以通过“我的”页面的打卡按钮进行打卡。

2) 显示连续打卡：用户连续进行打卡会显示连续打卡的天数。

3) 显示打卡天数：显示总共点击打卡的天数。

4) 显示账单总笔数：使用记账应用以来一共的账单数。

### 账单模块

1) 记录某笔账单条目：在“账单”页面，点击记账按钮，选择对应的账单分类，打开弹窗，可以输入备注、选择账单日期以及计算金额，就可以完成一笔账的记录了。

2) 删除某笔账单条目：在“账单”页面，手指向右滑动想要删除的账单条目，就会出现红色的删除按钮，点击即可实现删除当前条目。

3) 以月为单位查看账单：在“账单”页面的左上角有显示当前年月份，点击它，就可以选择某年某月的所有账单，默认显示当前月的账单，如果取消选择则会依然显示当月的账单列表。

4) 修改某笔账单的信息：在“账单”页面，可以看到当前月的所有账单信息，可以点击账单条目的图标修改账单分类，点击账单条目的标题修改备注，点击账单条目金额数目修改金额。

5) 查看当月总收支：在“账单”页面上方有显示选择的当月的总收入和总支出。

6) 查看收入支出排行榜：在“账单”页面点击总收入和总支出，即可查看对应的当月收支排行榜，可以选择根据时间、金额进行排序。

### 设置分类模块

1) 添加自定义账单分类：在选择账单分类页面，找到最后一个黄色的选项“设置”，进入“分类设置”页面，点击右上方添加分类，即可选择分类图标、输入类别名称、选择收支进行添加自定义账单分类，在“分类设置”页面可以进行查看。

2) 修改自定义账单分类：在“分类设置”页面，可以点击自定义分类，然后对这些自定义分类的名称、图标、收支进行修改。

3) 删除自定义账单分类：在“分类设置”页面，可以点击自定义分类的左边的红色减号按钮，对该自定义分类进行删除，并提醒用户删除当前自定义分类的同时会删除对应的所有账单。

### 图表模块

1) 时间分组呈现折线图：在“图标”页面，可以根据收入支出查看折线图，默认显示本周的支出折线图，还可以进一步选择周、月、年进行查看折线图。

2) 分类排行榜：查看折线图的同时也会把收入或支出的分类排行榜显示出来，并且是降序排列。

3) 查看当前排行榜详情：点击排行榜的项目，还可以进一步查看该分类的所有账单条目，列表可以根据金额或时间进行排序显示。

### 数据分析模块

1) 查看当年每月收支结余：在“我的”页面，会显示当月的收入、支出、结余，点击账单进入，可以选择查看某年的总收支、结余情况以及每月的收支、结余情况，默认显示当前年份。

2) 月分析报表及建议：点击列表的某月条目，可以查看当月的分析报表，展示用户头像、用户名、以及加入应用的天数、根据当前月的收支分析出理财建议。该月和上月对比分析，进行建议。

3) 分析支出类别：根据支出类别的占比，展示饼状图，并显示每一项的占比以及金额。

4) 月支出排行榜：展示当前月的支出分类排行榜，并且可以查看更多，展示出完整的排行榜。

### 预算模块

1) 设置预算：在“我的”页面，点击设置预算，可以输入相应金额，对当月的预算进行设置，再次点击也可以修改预算和删除预算。

2) 查看结余：展示当前结余金额，并渲染结余和支出占比饼状图。

3) 查看支出：展示当前支出金额，并渲染结余和支出占比饼状图。





## 数据库概念设计

对需求的分析，然后设计出系统的整体功能的E-R模型图。概念模型作为信息世界到现实世界的一个过渡中间层次，关联着信息世界即机器世界与现实世界。通过概念数据模型展现两者的联系。

数据库的实体之间，都会互相关联，其关系可以通过实体联系图表现出来。数据库实体联系图如图：

![img](file:////private/var/folders/ct/x1wllnn567v1rzpc9tdyb_nc0000gn/T/com.kingsoft.wpsoffice.mac/wps-mac/ksohtml/wpsRuexzE.jpg) 



该图主要展现用户，账单，账单分类，打卡和预算的各种联系，一个用户可以记录多笔账，一个用户可以设置多个账单分类；一个用户可以记录打卡多次；一个用户每月只能设置一个预算；一笔账只能绑定一个账单分类；图中1，N分别代表映射关系的，一对一映射，以及一对多映射。

## 数据库逻辑设计

通过数据库概念E-R图，就能够大致的分析出系统的表结构。以下就是对应的表：用户表，账单表，账单分类表，预算表，打卡表。

![数据库实体联系图](/Users/mac/Desktop/毕设/数据库实体联系图.png)



### 用户表

| **字段名称** | **字段类型** | **是否允许为空** | **描述**         |
| ------------------ | ------------------ | ---------------------- | ---------------------- |
| _id                | ObjectId           | No                     | 用户ID                 |
| username           | String             | No                     | 用户名                 |
| password           | String             | No                     | 密码                   |
| gender             | Int32              | No                     | 性别                   |
| mobile_number      | String             | No                     | 手机号                 |
| email              | String             | No                     | 邮箱                   |
| avatar_url         | String             | Yes                    | 头像地址               |
| create_time        | Int32              | No                     | 创建时间（Unix时间戳） |

_id为用户的唯一标识，由MongoDB自动生成；

username也为用户的唯一标识，不可重复；

password是经MD5哈希算法加密后的32位字符串；

gender取值只有两个0或1，0表示女，1表示男；

mobile_number为手机号码11位字符串；

avatar_url只有当用户设置了头像之后才会存在该字段，用户展示头像；

create_time是创建时间格式为Unix时间戳，方便对时间段进行判断查询；

 

### 账单表


| **字段名称** | **字段类型** | **是否允许为空** | **描述**         |
| ------------------ | ------------------ | ---------------------- | ---------------------- |
| _id                | ObjectId           | No                     | 账单ID                 |
| user_id            | ObjectId           | No                     | 用户ID                 |
| category_id        | ObjectId           | No                     | 账单分类ID             |
| amount             | Int32              | No                     | 账单金额               |
| bill_time          | Int32              | No                     | 记账时间（Unix时间戳） |
| remark             | String             | Yes                    | 账单备注               |

_id为账单每条记录的唯一标识；

user_id对应的是用户表中的_id，可关联用户表进行查询；

category_id对应的是账单分类中的_id，可关联账单分类表进行查询；

bill_time是创建记录时的Unix时间戳，方便对时间段进行判断查询；

 

### 账单分类表

| **字段名称** | **字段类型** | **是否允许为空** | **描述**    |
| ------------ | ------------ | ---------------- | ----------- |
| _id          | ObjectId     | No               | 分类ID      |
| user_id      | ObjectId     | Yes              | 用户ID      |
| id           | String       | Yes              | 系统分类ID  |
| name         | String       | No               | 分类名称    |
| icon_n       | String       | No               | 分类图标名n |
| icon_l       | String       | No               | 分类图标名l |
| icon_s       | String       | No               | 分类图标名s |
| is_income    | Int32        | No               | 是收入      |
| is_system    | Int32        | No               | 是系统分类  |

对于id字段使用String类型，其作用在于区别系统分类的ID，自定义分类使用_id字段进行区分；

对于icon_n字段，icon_l字段，icon_s字段用于判断分类图标的键名；

user_id对应的是用户表中的_id，可关联用户表进行查询，这里只有自定义账单分类才有user_id字段；

is_income有两个取值0或1，0为支出，1为收入；

is_system有两个取值0或1，0为自定义分类，1为系统分类；

 

### 预算表

| **字段名称** | **字段类型** | **是否允许为空** | **描述**               |
| ------------ | ------------ | ---------------- | ---------------------- |
| _id          | ObjectId     | No               | 预算ID                 |
| user_id      | ObjectId     | No               | 用户ID                 |
| create_time  | Int32        | No               | 创建时间（Unix时间戳） |
| budget_value | Int32        | No               | 预算值                 |

_id是预算的唯一标识；

user_id对应的是用户表中的_id，可关联用户表进行查询；

create_time是创建记录时的Unix时间戳，方便对时间段进行判断查询；

Budget_value是当前设置的预算值，可进行修改。

 

### 打卡表

| **字段名称** | **字段类型** | **是否允许为空** | **描述**               |
| ------------ | ------------ | ---------------- | ---------------------- |
| _id          | ObjectId     | No               | 打卡ID                 |
| user_id      | ObjectId     | No               | 用户ID                 |
| date         | String       | No               | 打卡日期               |
| clock_date   | Int32        | No               | 打卡日期（Unix时间戳） |

_id是打卡的唯一标识；

user_id对应的是用户表中的_id，可关联用户表进行查询；

date是打卡日期，形式如：2021-05-12 00:00:00

clock_time是打卡时创建的Unix时间戳，方便对时间段进行判断查询；