import * as sm from "shumaiml";


const label_size = 2;
const img_size = 1024 * 3;

async function load_from_file(fn) {
  const stream = Bun.file(fn).stream()
  const reader = stream.getReader()
  let coarse_labels = [];
  let fine_labels = [];
  let imgs = [];

  function digest(img) {
    const coarse_ohe = new Float32Array(20);
    coarse_ohe[img[0]] = 1;
    const fine_ohe = new Float32Array(100);
    fine_ohe[img[1]] = 1;
    coarse_labels.push(coarse_ohe);
    fine_labels.push(fine_ohe);
    const img_only = new Uint8Array(img_size);
    img_only.set(0, img.slice(2, img.length));
    const x = Float32Array.from(img_only);
    imgs.push(sm.tensor(x).reshape([3, 32, 32]));
  }

  let img = new Uint8Array(label_size + img_size); // 3 channel
  let offset = 0;
  let size = 0;
  while (true) {
    const b = await reader.read()
    if (!b.value) {
      break
    }
    let i = 0;
    let n = 0;
    let delta = 0;
    delta = img_size + label_size - offset;
    n = i + delta;
    while (n < b.value.length) {
      img.set(offset, b.value.slice(i, n));
      digest(img);
      i += delta;
      offset = 0;
      delta = img_size + label_size - offset;
      n = i + delta;
    }
    const missing = n - b.value.length;
    const new_offset = img_size + label_size - missing;
    img.set(offset, b.value.slice(i, i + new_offset));
    offset = new_offset;
    size += b.value.length;
    console.log(`\u001b[2K processing ${size} bytes...\u001b[A`);
  }
  console.log(`\u001b[2K\u001b[A`);
  if (offset === img_size + label_size) {
    digest(img);
  } else if (offset != 0) {
    throw "corrupted file";
  }
  return {
    imgs: imgs,
    coarse_labels: coarse_labels,
    fine_labels: fine_labels
  };
}

const train_set = await load_from_file("cifar-100-binary/train.bin");
const test_set = await load_from_file("cifar-100-binary/test.bin");
console.log("loaded", train_set.imgs.length, "train images");
console.log("loaded", test_set.imgs.length, "test images");