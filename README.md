# question-library

功能：

- 导入txt格式的原始题库文件，并解析为json格式的题库文件
- 导入json题库，并提供多个选项进行答题测试
    - 在导入题库时，会显示含答案的问题可供参考
    - 答题模式目前支持的功能：
        - 规定答题数量
        - 规定问题显示顺序（正序 | 乱序）
        - 规定问题选项显示顺序（正序 | 乱序）
        - 打完一套题之后的错题查看

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
