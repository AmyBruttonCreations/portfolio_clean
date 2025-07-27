@echo off
echo Converting WOOGA videos...
cd "WOOGA"
mkdir converted 2>nul
ffmpeg -i "CatchTheCat_MakingOf.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/CatchTheCat_MakingOf.mp4"
ffmpeg -i "Jj H Ua-Liveaction Catchthecat 30S En 1920X1080 Cta.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/Jj H Ua-Liveaction Catchthecat 30S En 1920X1080 Cta.mp4"

echo Converting GEBERIT_KATALYST videos...
cd "../GEBERIT_KATALYST"
mkdir converted 2>nul
ffmpeg -i "Mountaineer.mov" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/Mountaineer.mp4"
ffmpeg -i "8aY7k4GvsYw_576.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/8aY7k4GvsYw_576.mp4"
ffmpeg -i "EJnj8GHKj_C_576.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/EJnj8GHKj_C_576.mp4"
ffmpeg -i "UzMuRZqFubT_576.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/UzMuRZqFubT_576.mp4"
ffmpeg -i "TKu5EoYTpWD_576.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/TKu5EoYTpWD_576.mp4"

echo Converting S&E videos...
cd "../S&E"
mkdir converted 2>nul
ffmpeg -i "woolyAnimationTest.mov" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/woolyAnimationTest.mp4"
ffmpeg -i "Episode01.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/Episode01.mp4"
ffmpeg -i "Episode02.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/Episode02.mp4"
ffmpeg -i "nextup.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/nextup.mp4"
ffmpeg -i "gif01.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/gif01.mp4"
ffmpeg -i "gif02.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/gif02.mp4"
ffmpeg -i "gif03.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/gif03.mp4"
ffmpeg -i "gif04.mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/gif04.mp4"

echo Converting 908 videos...
cd "../908"
mkdir converted 2>nul
ffmpeg -i "Roche _ Mut macht Originale - Christoph Kolumbus (1080p with 24fps).mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/Roche _ Mut macht Originale - Christoph Kolumbus (1080p with 24fps).mp4"
ffmpeg -i "Roche _ Mut macht Originale - Thomas Edison (1080p with 24fps).mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/Roche _ Mut macht Originale - Thomas Edison (1080p with 24fps).mp4"
ffmpeg -i "AvL Brand Storyworlds (720p with 25fps).mp4" -vf "scale=1280:720" -c:v libx264 -crf 23 -c:a aac -b:a 128k "converted/AvL Brand Storyworlds (720p with 25fps).mp4"

echo All conversions complete!
pause