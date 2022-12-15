@echo off 
del /f /s /q .\new\*
del /f /s /q .\old\*
del /f /s /q .\single\*
echo [] > .\changeList.json
@pause