## scripts

```bash
{
   yarn rue:gen -f -s ./src/generate/records record User "name:string, age:number"
   yarn rue:gen -e js -f -s ./src/generate/records record User "name:string, age:number"
   yarn rue:gen -f -s ./src/generate/models model TmpUser "name:string, age:number"
   yarn rue:gen -e js -f -s ./src/generate/models model TmpUser "name:string, age:number"
   yarn rue:gen -f -s ./src/generate/forms form ContactForm "name:string, email:string"
   yarn rue:gen -e js -f -s ./src/generate/forms form ContactForm "name:string, email:string"
}
```
