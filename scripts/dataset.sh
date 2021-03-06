#!/bin/bash
# script for create folder with images
# create symlinks https://stackoverflow.com/questions/1347105/linux-link-all-files-from-one-to-another-directory
path="/net/hci-storage02/groupfolders/compvis/datasets/Animals_with_Attributes2"

newDir="$path/single_folder_images2/"
mkdir ${newDir}
echo "created: $newDir"

for d in $(find ${path}/JPEGImages -maxdepth 1 -type d)
do
  #Do something, the directory is accessible with $d:
  echo ${d}
  ln -s ${d}/* ${newDir}
done

#ln -s ${path}/JPEGImages/antelope/* ${path}/single_folder_images2/
