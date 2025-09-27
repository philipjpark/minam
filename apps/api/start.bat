@echo off

REM Set the OpenAI API key from environment or prompt user
if "%OPENAI_API_KEY%"=="" (
    echo Please set your OpenAI API key:
    set /p OPENAI_API_KEY=
)

echo Starting Minam API server on port 8787...
echo OpenAI API key configured: %OPENAI_API_KEY:~0,10%...

REM Build and run the Rust server
cargo run
