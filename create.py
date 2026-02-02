import os

structure = {
    'src': {
        'api': ['auth.ts', 'payment.ts', 'index.ts'],
        'core': {'Auth': ['AuthContext.tsx', 'useAuth.ts'], 'index.ts': None},
        'navigation': ['AuthNavigator.tsx', 'RootNavigator.tsx', 'index.ts'],
        'screens': {'Home': ['Home.tsx', 'index.ts'], 'Login': ['Login.tsx', 'index.ts'], 'index.ts': None},
        'ui': ['Button.tsx', 'Input.tsx', 'Screen.tsx', 'Text.tsx', 'index.ts'],
        'mock': ['auth.ts', 'payment.ts', 'index.ts']
    },
    'App.tsx': None
}

def create_files(base_path, structure):
    for key, value in structure.items():
        full_path = os.path.join(base_path, key)
        if value is None:
            # Create empty file
            with open(full_path, 'w') as f:
                pass
        elif isinstance(value, list):
            # Create directory if it doesn't exist
            os.makedirs(full_path, exist_ok=True)
            for file in value:
                file_path = os.path.join(full_path, file)
                with open(file_path, 'w') as f:
                    pass
        elif isinstance(value, dict):
            # Create directory if it doesn't exist
            os.makedirs(full_path, exist_ok=True)
            create_files(full_path, value)

if __name__ == "__main__":
    create_files(os.getcwd(), structure)
    print("Estructura de proyecto creada correctamente.")
