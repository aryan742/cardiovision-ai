import os
import logging

def setup_logger(name, log_level=logging.INFO):
    """Set up a professional logger."""
    logger = logging.getLogger(name)
    logger.setLevel(log_level)
    
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s | %(name)s | %(levelname)s | %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger

def get_project_root():
    """Return the absolute path of the project root."""
    return os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def ensure_dirs(dirs):
    """Ensure that the given directories exist."""
    for d in dirs:
        os.makedirs(d, exist_ok=True)
