declare namespace payload {
  interface ExecutionInput {
    id: QueryId;
    src: SrcData;
    query: Query;
  }

  // Id
  type QueryId = string;

  // Src
  type SrcData = CollectionSrc | GranuleSrc;

  interface CollectionSrc {
    collection: Collection;
  }
  type Collection = any; // TODO: Populate

  interface GranuleSrc {
    granule: Granule;
  }
  type Granule = any; // TODO: Populate

  // Query
  interface Query {
    bbox?: BBox;
    fields?: string[];
  }

  // from GeoJSON spec: https://tools.ietf.org/html/rfc7946#section-5
  type MinX = number;
  type MinY = number;
  type MaxX = number;
  type MaxY = number;
  type BBox = [MinX, MinY, MaxX, number]; // 2d support only, lon lat
}
