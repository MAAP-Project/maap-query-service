declare namespace payload {
  interface ExecutionInput {
    id: QueryId;
    src: SrcData;
    query: Query;
  }

  // Id
  type QueryId = string;

  // Src
  type SrcData = CollectionSrc;

  // NOTE: We're making the assumption that the input Collection object will
  // come in the format that is returned by CMR as XML and then converted to
  // JSON.
  interface CollectionSrc {
    Collection: Collection;
  }
  interface Collection {
    ShortName: string;
    VersionId: string;
  }

  // Query
  interface Query {
    where?: Record<string, string | number | boolean>;
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
