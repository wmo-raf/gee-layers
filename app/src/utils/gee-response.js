const flattenAreaHist = (areaHist) => {
  return areaHist.groups.reduce((all, item) => {
    const group = item.group;

    let m2Val = 0;

    for (let pixel_size in item.histogram) {
      m2Val += Number(pixel_size) * item.histogram[pixel_size];
    }

    all[group] = m2Val / 10000;

    return all;
  }, {});
};

module.exports = { flattenAreaHist };
