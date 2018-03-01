#### 使用

    suphttps


依次遍历目录中所有文件内容，将 http(s):// 替换为 //



#### 可配参数

    suphttps -a php+jade+tpl


-a 添加支持的扩展文件的后缀名，以 + 号分割


默认支持的文件扩展名为: css、js、scss、html


#### 说明

如果出现如下报错

    Error: ENFILE: file table overflow


表示文件目录太多，请分部进行，或者参考[这里](https://github.com/meteor/meteor/issues/8057)
