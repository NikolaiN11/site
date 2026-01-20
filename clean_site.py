import os

files_to_update = [
    'marketing.html',
    'it.html',
    'optimization.html',
    'about.html',
    'contacts.html'
]

new_nav_content = """<ul class="space-y-2 text-sm">
                        <li><a href="index.html">Главная</a></li>
                        <li><a href="marketing.html">Маркетинг</a></li>
                        <li><a href="it.html">IT</a></li>
                        <li><a href="optimization.html">Оптимизация производства</a></li>
                        <li><a href="about.html">О нас</a></li>
                        <li><a href="contacts.html">Контакты</a></li>
                    </ul>"""

base_dir = r"c:\Users\nks3l\Documents\SmartSolSite"

for filename in files_to_update:
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Ищем блок навигации. Он обычно после "Навигация</h4>"
    # Попробуем заменить блок <ul>...</ul> следующий за заголовком Навигация
    
    start_marker = '<h4 class="font-semibold text-white mb-4">Навигация</h4>'
    
    if start_marker in content:
        # Находим начало списка
        start_idx = content.find(start_marker) + len(start_marker)
        ul_start = content.find('<ul', start_idx)
        ul_end = content.find('</ul>', ul_start) + 5
        
        if ul_start != -1 and ul_end != -1:
            old_ul = content[ul_start:ul_end]
            # Заменяем только если контент отличается, чтобы не портить форматирование лишний раз
            # Хотя проще просто заменить
            
            new_content = content[:ul_start] + new_nav_content + content[ul_end:]
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated footer in {filename}")
        else:
            print(f"Could not find ul block in {filename}")
    else:
        print(f"Could not find Navigation header in {filename}")

# Удаление старых файлов
files_to_delete = ['services.html', 'cases.html', 'clients.html']
for filename in files_to_delete:
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        print(f"Deleted {filename}")
    else:
        print(f"File {filename} does not exist (already deleted?)")
