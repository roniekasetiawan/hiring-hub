#!/bin/bash

# pastikan kamu menjalankannya dari root project (di luar folder src)
mkdir -p src/@core/{authentication,components,layouts,theme/{tokens/palettes/partials/common}}
mkdir -p src/{app,components,configs,configurations,context,hooks,layouts,modules,services,store,styles,types,utility,variables}

# subfolder di dalam layouts
mkdir -p src/@core/layouts/Main/{Container,Header,Sidebar}

# file placeholder (optional, biar git ga kosong)
touch src/instrumentation.ts
touch src/instrumentation-client.ts

# sample index files
touch src/@core/{components/index.tsx,layouts/index.tsx,theme/index.ts,theme/tokens/index.ts,theme/tokens/partials/common/light.ts,theme/tokens/partials/common/components.ts,theme/tokens/partials/common/typography.ts}
touch src/@core/authentication/AuthenticationProvider.tsx

echo "✅ Folder structure created successfully!"
