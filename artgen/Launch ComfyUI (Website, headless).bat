@echo off
rem Website Test art station, headless: no browser, no manager, no live previews. Server on http://127.0.0.1:8188.
rem Run it in the background:  start "" /min "F:\ArtGen\Website Test\artgen\Launch ComfyUI (Website, headless).bat"
rem Log: artgen\user\comfyui_headless.log. Stop it with:  python artgen\generate.py --stop
cd /d F:\ArtGen\ComfyUI
venv\Scripts\python.exe main.py --preview-method none --user-directory "%~dp0user" --input-directory "%~dp0input" --output-directory "%~dp0output" --extra-model-paths-config "%~dp0extra_model_paths.yaml" > "%~dp0user\comfyui_headless.log" 2>&1
