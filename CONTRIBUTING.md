# Formatting

Please use js-beautify for TypeScript and JavaScript files, and black for Python files

```
bun js-beautify --indent-size 2 $(find . -name "*.ts")
bun js-beautify --indent-size 2 $(find . -name "*.js")
black $(find . -name "*.py")
```
