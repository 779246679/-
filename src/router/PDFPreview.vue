<template>
  <div>
    <canvas ref="pdfViewer"></canvas>
  </div>
</template>

<script>
import pdfjsLib from "pdfjs-dist";

export default {
  name: "PDFViewer",
  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.loadPDF();
  },
  methods: {
    loadPDF() {
      // const pdfData = await this.fetchPDFData();
      // const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      this.renderPDF(pdfUrl);
    },
    fetchPDFData() {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", this.pdfUrl, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Failed to fetch PDF (${xhr.status})`));
          }
        };
        xhr.onerror = () => {
          reject(new Error("Failed to fetch PDF"));
        };
        xhr.send();
      });
    },
    renderPDF(pdf) {
      const canvas = this.$refs.pdfViewer;
      const context = canvas.getContext("2d");

      const scale = 1.5;
      const viewport = pdf.getPage(1).getViewport({ scale });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      pdf.getPage(1).render(renderContext);
    },
  },
};
</script>
