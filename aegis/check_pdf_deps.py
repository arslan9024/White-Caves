import importlib.util

for mod in ["reportlab", "PIL", "charset_normalizer"]:
    print(mod, bool(importlib.util.find_spec(mod)))
