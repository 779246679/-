<template>
  <div>
    <input type="file" @change="convertToMp4" ref="fileInput" />
    <video v-if="outputVideoUrl" :src="outputVideoUrl" controls />
  </div>
</template>

<script>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
export default {
  name: "Video-p",
  data() {
    return {
      ffmpeg: createFFmpeg({ log: true }),
      outputVideoUrl: "",
    };
  },
  methods: {
    async convertToMp4(event) {
      const { ffmpeg } = this;
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      this.outputVideoUrl = ""; // Clear previous video URL if any
      const outputFilename = "output.mp4";

      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      // Write the file to memory
      ffmpeg.FS("writeFile", file.name, await fetchFile(file));

      // Run the FFmpeg command to convert the video to mp4
      await ffmpeg.run("-i", file.name, "-c:v", "libx264", outputFilename);

      // Read the result
      const data = ffmpeg.FS("readFile", outputFilename);

      // Create a URL for the web page to access the file
      const videoBlob = new Blob([data.buffer], { type: "video/mp4" });
      this.outputVideoUrl = URL.createObjectURL(videoBlob);
    },
  },
};
</script>
