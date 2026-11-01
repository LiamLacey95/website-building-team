@echo off
rem Website Test art station. Engine + models: F:\ArtGen\ComfyUI. Workflows, inputs, outputs: this folder.
rem Opens the ComfyUI UI in the browser. For background/headless use, run "Launch ComfyUI (Website, headless).bat" or just artgen\generate.py.
cd /d F:\ArtGen\ComfyUI
venv\Scripts\python.exe main.py --enable-manager --preview-method auto --user-directory "%~dp0user" --input-directory "%~dp0input" --output-directory "%~dp0output" --extra-model-paths-config "%~dp0extra_model_paths.yaml" --auto-launch
pause
