# html_minify.py
import re

input_path = "index.html"
output_path = "output_min.html"

with open(input_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. HTML 주석 제거
html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)

# 2. 줄바꿈, 탭 제거
html = html.replace("\n", "").replace("\r", "").replace("\t", "")

# 3. 다중 공백 하나로 줄이기
html = re.sub(r'\s{2,}', ' ', html)

# 4. 태그 사이의 공백 제거
html = re.sub(r'>\s+<', '><', html)

# 5. 앞뒤 공백 제거
html = html.strip()

with open(output_path, "w", encoding="utf-8") as f:
    f.write(html)

print("HTML 미니파이 완료:", output_path)
