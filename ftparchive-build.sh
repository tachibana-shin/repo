apt-ftparchive packages "./debian" > public/Packages
bzip2 -c9k public/Packages > public/Packages.bz2
gzip -c public/Packages > public/Packages.gz
xz -k public/Packages
