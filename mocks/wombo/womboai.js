const { buildDefaultInstance } = require("wombo-dream-api");
require("dotenv").config();

module.exports = async function (prompt, styleId = 3) {
  try {
    const credentials = {
      email: process.env.WOMBO_EMAIL,
      password: process.env.WOMBO_PASS,
    };

    let splitPrompt = prompt.split(",");
    let tryGetStyle = splitPrompt.pop().trim();

    // signin is automatically done when you interract with the api if you pass credentials
    const wombo = buildDefaultInstance(credentials);

    // if you want to sign up as new user:
    // await wombo.authentifier.signUp(credentials);

    // fetch all styles
    const styles = await wombo.fetchStyles();
    console.log(
      styles.map((style) => {
        if (style.name.toLowerCase() === tryGetStyle.toLowerCase()) {
          styleId = style.id;
          return `*[${style.id}] ${style.name}`;
        }
		return `[${style.id}] ${style.name}`;

      })
    );

    // upload image [ONLY JPEG SUPPORTED]
    // const uploadedImage = await wombo.uploadImage(
    // 	fs.readFileSync('./image.jpeg')
    // );

    // generate picture from image
    const generatedTask = await wombo.generatePicture(
      prompt,
      styles[styleId].id,
      (taskInProgress) => {
        console.log(
          `[${taskInProgress.id}]: ${taskInProgress.state} | step: ${taskInProgress.photo_url_list.length}`
        );
      }
      // { mediastore_id: uploadedImage.id, weight: 'HIGH' }
    );

    console.log(
      `[${generatedTask.id}]: ${generatedTask.state} | final url: ${generatedTask.result?.final}`
    );

    // to interract with the gallery, YOU NEED TO HAVE A USERNAME!
    // if you just created the account and it doesn't have a username, set it with:
    // await wombo.setUsername('myusername');

    // save an image in the gallery
    const savedTask = await wombo.saveTaskToGallery(
      generatedTask.id,
      "my wonderful creation",
      true,
      true
    );

    console.log("image saved!");

    return generatedTask.result?.final; //img url

    // obtain gallery tasks
    // const galleryTasks = await wombo.fetchGalleryTasks();

    // console.log(galleryTasks);
  } catch (error) {
    console.error(error);
  }
};
