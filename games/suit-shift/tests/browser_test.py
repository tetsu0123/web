"""Compatibility entry point for the current strategy-edition browser tests."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name('strategy-browser.py')),run_name='__main__')
