import os
import json

result = {}
for path, dirs, files in os.walk("unicalc_contained/backend/tools"):
    for file in files:
        if file.endswith('.java'):
            # Get relative path from content directory
            rel_path = path.split("tools")[1]
            rel_path = rel_path[1:]  # Remove start /
            name = file[:-5]  # Remove '.java'
            # Store path components
            path_list = [] if rel_path == '.' else rel_path.split(os.sep)
            result[name] = path_list

with open('unicalc_contained/frontend/public/resources/tool_paths.json', 'w') as f:
    json.dump(result, f, indent=2)