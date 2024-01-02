# cleanohash
Simple tool to support smartphone backup

# Usage

## normal flow

1. copy picturews from your smartphone in tmpfoto directory owherever you like
2. clean temporary pictures directory to remove duplicates from the past 
```bash 
node ~/scripts/cleanohash.js -db ~/.config/cleanohash.db -c C -d ./tmpfoto
```
3. now move the pictures from tmpphoto to main backup directory (i.e: foto)
4. update hashing db 
```bash
node ~/scripts/cleanohash.js -db ~/.config/cleanohash.db -c H -d ./foto
```

