#!/bin/bash

# Set the OpenAI API key from environment or prompt user
if [ -z "$OPENAI_API_KEY" ]; then
    echo "Please set your OpenAI API key:"
    read -s OPENAI_API_KEY
    export OPENAI_API_KEY
fi

echo "Starting Minam API server on port 8787..."
echo "OpenAI API key configured: ${OPENAI_API_KEY:0:10}..."

# Build and run the Rust server
cargo run
