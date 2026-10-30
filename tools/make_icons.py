"""TV Kumanda ana ekran simgelerini üretir: docs/icon-180.png ve docs/icon-512.png."""
from pathlib import Path

from PIL import Image, ImageDraw

WEB = Path(__file__).resolve().parent.parent / "docs"
S = 1024  # yüksek çözünürlükte çiz, sonra küçült

img = Image.new("RGB", (S, S))
d = ImageDraw.Draw(img)
top, bottom = (20, 30, 52), (11, 13, 18)
for y in range(S):
    t = y / (S - 1)
    d.line([(0, y), (S, y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(top, bottom)))

# TV ekranı
d.rounded_rectangle((170, 230, 854, 690), radius=56, outline=(233, 236, 243), width=44)
d.line((400, 800, 624, 800), fill=(233, 236, 243), width=44)
d.line((512, 712, 512, 790), fill=(233, 236, 243), width=36)

# Ekrandaki imleç
cx, cy, k = 470, 330, 1.25
arrow = [(0, 0), (0, 230), (60, 172), (104, 262), (146, 242), (102, 154), (182, 154)]
d.polygon([(cx + x * k, cy + y * k) for x, y in arrow], fill=(79, 140, 255))

for size in (180, 512):
    img.resize((size, size), Image.LANCZOS).save(WEB / f"icon-{size}.png", optimize=True)
print("simgeler yazıldı:", WEB)
