export default async (src: payload.SrcData) => {
  switch (src.Collection.ShortName) {
    case "GEDI Cal/Val Field Data_1":
      return "gedi-postgres";

    default:
      return "";
  }
};
