export const defaultFilters = ({ id, name, year }) => [
  {
    type: "eq",
    arguments: ["system:index", String(id)],
    name,
    year,
  },
];

const EARTH_ENGINE_LAYER = "earthEngine";

export const earthEngineLayers = () => [
  {
    layer: EARTH_ENGINE_LAYER,
    datasetId: "WorldPop/GP/100m/pop",
    name: "Population",
    unit: "people per hectare",
    description: "Estimated number of people living in an area.",
    source: "WorldPop / Google Earth Engine",
    sourceUrl:
      "https://developers.google.com/earth-engine/datasets/catalog/WorldPop_GP_100m_pop",
    img: "images/population.png",
    defaultAggregations: ["sum", "mean"],
    periodType: "Yearly",
    filters: ({ id, name, year }) => [
      {
        id,
        name,
        type: "eq",
        arguments: ["year", year],
      },
    ],
    mosaic: true,
    params: {
      min: 0,
      max: 10,
      palette: "#fee5d9,#fcbba1,#fc9272,#fb6a4a,#de2d26,#a50f15", // Reds
    },
    opacity: 0.9,
  },
  {
    layer: EARTH_ENGINE_LAYER,
    datasetId: "WorldPop/GP/100m/pop_age_sex_cons_unadj",
    name: "Population age groups",
    unit: "people per hectare",
    description:
      "Estimated number of people living in an area, grouped by age and gender.",
    source: "WorldPop / Google Earth Engine",
    sourceUrl:
      "https://developers.google.com/earth-engine/datasets/catalog/WorldPop_GP_100m_pop_age_sex_cons_unadj",
    img: "images/population.png",
    periodType: "Yearly",
    defaultAggregations: ["sum", "mean"],
    bands: [
      {
        id: "M_0",
        name: "Male 0 - 1 years",
      },
      {
        id: "M_1",
        name: "Male 1 - 4 years",
      },
      {
        id: "M_5",
        name: "Male 5 - 9 years",
      },
      {
        id: "M_10",
        name: "Male 10 - 14 years",
      },
      {
        id: "M_15",
        name: "Male 15 - 19 years",
      },
      {
        id: "M_20",
        name: "Male 20 - 24 years",
      },
      {
        id: "M_25",
        name: "Male 25 - 29 years",
      },
      {
        id: "M_30",
        name: "Male 30 - 34 years",
      },
      {
        id: "M_35",
        name: "Male 35 - 39 years",
      },
      {
        id: "M_40",
        name: "Male 40 - 44 years",
      },
      {
        id: "M_45",
        name: "Male 45 - 49 years",
      },
      {
        id: "M_50",
        name: "Male 50 - 54 years",
      },
      {
        id: "M_55",
        name: "Male 55 - 59 years",
      },
      {
        id: "M_60",
        name: "Male 60 - 64 years",
      },
      {
        id: "M_65",
        name: "Male 65 - 69 years",
      },
      {
        id: "M_70",
        name: "Male 70 - 74 years",
      },
      {
        id: "M_75",
        name: "Male 75 - 79 years",
      },
      {
        id: "M_80",
        name: "Male 80 years and above",
      },
      {
        id: "F_0",
        name: "Female 0 - 1 years",
      },
      {
        id: "F_1",
        name: "Female 1 - 4 years",
      },
      {
        id: "F_5",
        name: "Female 5 - 9 years",
      },
      {
        id: "F_10",
        name: "Female 10 - 14 years",
      },
      {
        id: "F_15",
        name: "Female 15 - 19 years",
      },
      {
        id: "F_20",
        name: "Female 20 - 24 years",
      },
      {
        id: "F_25",
        name: "Female 25 - 29 years",
      },
      {
        id: "F_30",
        name: "Female 30 - 34 years",
      },
      {
        id: "F_35",
        name: "Female 35 - 39 years",
      },
      {
        id: "F_40",
        name: "Female 40 - 44 years",
      },
      {
        id: "F_45",
        name: "Female 45 - 49 years",
      },
      {
        id: "F_50",
        name: "Female 50 - 54 years",
      },
      {
        id: "F_55",
        name: "Female 55 - 59 years",
      },
      {
        id: "F_60",
        name: "Female 60 - 64 years",
      },
      {
        id: "F_65",
        name: "Female 65 - 69 years",
      },
      {
        id: "F_70",
        name: "Female 70 - 74 years",
        multiple: true,
      },
      {
        id: "F_75",
        name: "Female 75 - 79 years",
      },
      {
        id: "F_80",
        name: "Female 80 years and above",
      },
    ],
    filters: ({ id, name, year }) => [
      {
        id,
        name,
        type: "eq",
        arguments: ["year", year],
      },
    ],
    mosaic: true,
    params: {
      min: 0,
      max: 10,
      palette: "#fee5d9,#fcbba1,#fc9272,#fb6a4a,#de2d26,#a50f15", // Reds
    },
    opacity: 0.9,
    tileScale: 4,
  },
  {
    layer: EARTH_ENGINE_LAYER,
    datasetId: "GOOGLE/Research/open-buildings/v1/polygons",
    format: "FeatureCollection",
    name: "Building footprints",
    unit: "Number of buildings",
    description:
      "The outlines of buildings derived from high-resolution satellite imagery. Only for the continent of Africa.",
    notice:
      "Building counts are only available for smaller organisation unit areas.",
    error:
      "Select a smaller area or single organization unit to see the count of buildings.",

    source: "NASA / USGS / JPL-Caltech / Google Earth Engine",
    sourceUrl: "https://sites.research.google/open-buildings/",
    img: "images/buildings.png",
    aggregations: ["count"],
    defaultAggregations: ["count"],
    opacity: 0.9,
  },
  {
    layer: EARTH_ENGINE_LAYER,
    datasetId: "USGS/SRTMGL1_003",
    name: "Elevation",
    unit: "meters",
    description: "Elevation above sea-level.",
    source: "NASA / USGS / JPL-Caltech / Google Earth Engine",
    sourceUrl:
      "https://explorer.earthengine.google.com/#detail/USGS%2FSRTMGL1_003",
    img: "images/elevation.png",
    aggregations: ["min", "max", "mean", "median", "stdDev", "variance"],
    defaultAggregations: ["mean", "min", "max"],
    band: "elevation",
    params: {
      min: 0,
      max: 1500,
      palette: "#ffffd4,#fee391,#fec44f,#fe9929,#d95f0e,#993404", // YlOrBr
    },
    opacity: 0.9,
  },
  {
    layer: EARTH_ENGINE_LAYER,
    datasetId: "UCSB-CHG/CHIRPS/PENTAD",
    name: "Precipitation",
    unit: "millimeter",
    description:
      "Precipitation collected from satellite and weather stations on the ground. The values are in millimeters within 5 days periods. Updated monthly, during the 3rd week of the following month.",
    source: "UCSB / CHG / Google Earth Engine",
    sourceUrl:
      "https://explorer.earthengine.google.com/#detail/UCSB-CHG%2FCHIRPS%2FPENTAD",
    periodType: "Custom",
    band: "precipitation",
    aggregations: ["min", "max", "mean", "median", "stdDev", "variance"],
    defaultAggregations: ["mean", "min", "max"],
    mask: true,
    img: "images/precipitation.png",
    params: {
      min: 0,
      max: 100,
      palette: "#eff3ff,#c6dbef,#9ecae1,#6baed6,#3182bd,#08519c", // Blues
    },
    opacity: 0.9,
  },
  {
    layer: EARTH_ENGINE_LAYER,
    datasetId: "MODIS/006/MOD11A2",
    name: "Temperature",
    unit: "°C during daytime",
    description:
      "Land surface temperatures collected from satellite. Blank spots will appear in areas with a persistent cloud cover.",
    source: "NASA LP DAAC / Google Earth Engine",
    sourceUrl:
      "https://explorer.earthengine.google.com/#detail/MODIS%2FMOD11A2",
    img: "images/temperature.png",
    aggregations: ["min", "max", "mean", "median", "stdDev", "variance"],
    defaultAggregations: ["mean", "min", "max"],
    periodType: "Custom",
    band: "LST_Day_1km",
    mask: true,
    methods: {
      toFloat: [],
      multiply: [0.02],
      subtract: [273.15],
    },
    params: {
      min: 0,
      max: 40,
      palette:
        "#fff5f0,#fee0d2,#fcbba1,#fc9272,#fb6a4a,#ef3b2c,#cb181d,#a50f15,#67000d", // Reds
    },
    opacity: 0.9,
  },
  {
    layer: EARTH_ENGINE_LAYER,
    datasetId: "MODIS/006/MCD12Q1", // No longer in use: 'MODIS/051/MCD12Q1',
    name: "Landcover",
    description: "Distinct landcover types collected from satellites.",
    source: "NASA LP DAAC / Google Earth Engine",
    sourceUrl:
      "https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MCD12Q1",
    periodType: "Yearly",
    band: "LC_Type1",
    filters: defaultFilters,
    defaultAggregations: "percentage",
    legend: {
      items: [
        // http://www.eomf.ou.edu/static/IGBP.pdf
        {
          id: 1,
          name: "Evergreen Needleleaf forest",
          color: "#162103",
        },
        {
          id: 2,
          name: "Evergreen Broadleaf forest",
          color: "#235123",
        },
        {
          id: 3,
          name: "Deciduous Needleleaf forest",
          color: "#399b38",
        },
        {
          id: 4,
          name: "Deciduous Broadleaf forest",
          color: "#38eb38",
        },
        {
          id: 5,
          name: "Mixed forest",
          color: "#39723b",
        },
        {
          id: 6,
          name: "Closed shrublands",
          color: "#6a2424",
        },
        {
          id: 7,
          name: "Open shrublands",
          color: "#c3a55f",
        },
        {
          id: 8,
          name: "Woody savannas",
          color: "#b76124",
        },
        {
          id: 9,
          name: "Savannas",
          color: "#d99125",
        },
        {
          id: 10,
          name: "Grasslands",
          color: "#92af1f",
        },
        {
          id: 11,
          name: "Permanent wetlands",
          color: "#10104c",
        },
        {
          id: 12,
          name: "Croplands",
          color: "#cdb400",
        },
        {
          id: 13,
          name: "Urban and built-up",
          color: "#cc0202",
        },
        {
          id: 14,
          name: "Cropland/Natural vegetation mosaic",
          color: "#332808",
        },
        {
          id: 15,
          name: "Snow and ice",
          color: "#d7cdcc",
        },
        {
          id: 16,
          name: "Barren or sparsely vegetated",
          color: "#f7e174",
        },
        {
          id: 17,
          name: "Water",
          color: "#aec3d6",
        },
      ],
    },
    mask: false,
    popup: "{name}: {value}",
    img: "images/landcover.png",
    opacity: 0.9,
  },
  {
    layer: EARTH_ENGINE_LAYER,
    legacy: true, // Kept for backward compability
    datasetId: "WorldPop/POP",
    name: "Population",
    unit: "people per km²",
    description: "Estimated number of people living in an area.",
    source: "WorldPop / Google Earth Engine",
    sourceUrl: "https://explorer.earthengine.google.com/#detail/WorldPop%2FPOP",
    img: "images/population.png",
    periodType: "Yearly",
    filters: ({ id, name, year }) => [
      {
        id,
        name,
        type: "eq",
        arguments: ["year", year],
      },
      {
        type: "eq",
        arguments: ["UNadj", "yes"],
      },
    ],
    mosaic: true,
    params: {
      min: 0,
      max: 1000,
      palette: "#fee5d9,#fcbba1,#fc9272,#fb6a4a,#de2d26,#a50f15", // Reds
    },
    methods: {
      multiply: [100], // Convert from people/hectare to people/km2
    },
    opacity: 0.9,
  },
  {
    layer: EARTH_ENGINE_LAYER,
    legacy: true, // Kept for backward compability
    datasetId: "NOAA/DMSP-OLS/NIGHTTIME_LIGHTS",
    name: "Nighttime lights",
    unit: "light intensity",
    description:
      "Light intensity from cities, towns, and other sites with persistent lighting, including gas flares.",
    source: "NOAA / Google Earth Engine",
    sourceUrl:
      "https://explorer.earthengine.google.com/#detail/NOAA%2FDMSP-OLS%2FNIGHTTIME_LIGHTS",
    periodType: "Yearly",
    band: "stable_lights",
    mask: true,
    img: "images/nighttime.png",
    params: {
      min: 0,
      max: 63,
      palette: "#ffffd4,#fee391,#fec44f,#fe9929,#ec7014,#cc4c02,#8c2d04", // YlOrBr
    },
    opacity: 0.9,
  },
];

export const getEarthEngineLayer = (id) =>
  earthEngineLayers().find((l) => l.datasetId === id);
