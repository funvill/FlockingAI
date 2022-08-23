## 
## From: https://github.com/crisbal/docker-torch-rnn
## And https://github.com/jcjohnson/torch-rnn
## 

## Start bash in the container

docker run --rm -v /mnt/c/dev/temp/birdnames:/root/torch-rnn/data/birdnames -ti crisbal/torch-rnn:base bash

## Preprocess the sample data

python scripts/preprocess.py \
--input_txt data/birdnames/EveryBirdSpecies.txt \
--output_h5 data/birdnames/EveryBirdSpecies.h5 \
--output_json data/birdnames/EveryBirdSpecies.json

## Train

th train.lua \
-input_h5 data/birdnames/EveryBirdSpecies.h5 \
-input_json data/birdnames/EveryBirdSpecies.json \
-checkpoint_name data/birdnames/cv \
-gpu -1

## Create samples

th sample.lua -checkpoint data/birdnames/cv_3350.t7 -length 2000 -gpu -1 