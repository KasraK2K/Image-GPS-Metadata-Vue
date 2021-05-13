const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const app = Vue.createApp({
  data() {
    return {
      canFormSubmit: false,
      navAccess: false,
      name: "GPS MetaData",
      render: "",
      uploaded: true,
      device: {},
      metadata: {},
      borderColor: "border-gray-300",
      filename: "",
      image: {},
    };
  },
  methods: {
    clickSubmit() {
      document.getElementById("submit").click();
    },
    fileDragIn() {
      this.borderColor = "border-indigo-600";
    },
    fileDragOut() {
      this.borderColor = "border-gray-300";
    },
    dropFile(e) {
      this.fileChanged(e, "drop");
    },
    chooseFiles: function () {
      document.getElementById("image").click();
    },
    fileChanged(e, type = "input") {
      this.render = "";
      if (type === "input") {
        this.image = e.target.files[0];
        this.borderColor = "border-indigo-600";
      } else if (type === "drop") {
        this.image = e.dataTransfer.files[0];
        this.borderColor = "border-indigo-600";
      } else {
        Toast.fire({
          icon: "error",
          title: "Input Type is not true.",
        });
      }
      this.filename = this.image.name;
      // NOTE: uncomment to show picture before upload
      // this.uploaded = true;
      // this.render = window.URL.createObjectURL(image);
      window.this = this;
      EXIF.getData(this.image, async function () {
        const meta = EXIF.getAllTags(this);
        window.this.canSubmit(meta);
      });
    },
    canSubmit(meta) {
      if (!meta) {
        this.canFormSubmit = false;
        Toast.fire({
          icon: "error",
          title: "Can not find any meta data!",
        });
      } else {
        if (!meta.GPSLatitudeRef) canFormSubmit = false;
        else if (!meta.GPSLatitude || !meta.GPSLatitude.length)
          canFormSubmit = false;
        else if (!meta.GPSLongitudeRef) canFormSubmit = false;
        else if (!meta.GPSLongitude || !meta.GPSLongitude.length)
          canFormSubmit = false;
        else {
          canFormSubmit = true;
        }
      }

      if (canFormSubmit) {
        const keys = Object.keys(meta);
        this.metadata.DateTimeOriginal = meta.DateTimeOriginal;
        for (const key of keys) {
          if (key.slice(0, 3) === "GPS") this.metadata[key] = meta[key];
        }
        Toast.fire({
          icon: "success",
          title: "GPS Metadata found.",
        });
      } else {
        this.metadata = {};
        this.metadata.DateTimeOriginal = meta.DateTimeOriginal;
        Toast.fire({
          icon: "error",
          title: "Can not find GPS Metadata!",
        });
      }
    },
    submit() {
      const formData = new FormData();
      formData.append("image", this.image);
      var requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
      };

      if (canFormSubmit) {
        fetch("/uploader.php", requestOptions)
          .then((response) => response.text())
          .then((result) => {
            result = JSON.parse(result);
            if (result.code === 200) {
              this.uploaded = true;
              this.render = result.url;
            }
            Toast.fire({
              icon: result.code === 200 ? "success" : "error",
              title: result.message,
            });
          })
          .catch((error) => console.log("error", error));
      } else {
        Toast.fire({
          icon: "error",
          title: "You can not submit this picture.",
        });
      }
    },
  },
  mounted() {
    /* ---------------------------- Check Geolocation --------------------------- */
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.navAccess = true;
        this.device.latitude = position.coords.latitude;
        this.device.longitude = position.coords.longitude;
        Toast.fire({
          icon: "success",
          title: "Geolocation found!",
        });
      },
      (error) => {
        this.navAccess = false;
        Swal.fire({
          icon: "error",
          title: "Geolocation Error",
          text: "You should allow Geolocation.",
        });
        console.log(error);
      }
    );
    /* -------------------------------------------------------------------------- */
  },
});
