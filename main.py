import os
import argparse
from src.utils import setup_logger, get_project_root
from src.preprocess import run_preprocessing_pipeline
from src.train import run_training_pipeline
from src.evaluate import evaluate_model

logger = setup_logger('main')

def main(data_path=None):
    logger.info("="*50)
    logger.info("Starting CardioVision AI Pipeline")
    logger.info("="*50)
    
    root = get_project_root()
    models_dir = os.path.join(root, 'models')
    
    if not data_path:
        data_path = os.path.join(root, 'data', 'raw', 'cardio_train.csv')
        
    if not os.path.exists(data_path):
        # Fallback to try finding any csv in raw
        raw_dir = os.path.join(root, 'data', 'raw')
        csv_files = [f for f in os.listdir(raw_dir) if f.endswith('.csv')]
        if csv_files:
            data_path = os.path.join(raw_dir, csv_files[0])
            logger.info(f"Using found dataset: {data_path}")
        else:
            logger.error(f"Dataset not found at {data_path}.")
            logger.error("Please place your CSV dataset in the data/raw/ directory.")
            return

    # 1. Preprocess
    logger.info("\n--- Step 1: Data Preprocessing ---")
    run_preprocessing_pipeline(data_path, models_dir)
    
    # 2. Train
    logger.info("\n--- Step 2: Model Training ---")
    run_training_pipeline(models_dir)
    
    # 3. Evaluate
    logger.info("\n--- Step 3: Model Evaluation ---")
    evaluate_model(models_dir)
    
    logger.info("="*50)
    logger.info("Pipeline Complete!")
    logger.info("You can now run the Streamlit app: streamlit run app/app.py")
    logger.info("="*50)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CardioVision AI Training Pipeline")
    parser.add_argument('--data', type=str, help='Path to the raw CSV dataset', default=None)
    args = parser.parse_args()
    
    main(args.data)
