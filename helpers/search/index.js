// export const DOUBT_QUERY_API = `${process.env.REACT_APP_HOST_IDENTIFIER}/api/as/v1/engines/doubt-forum-engine/query_suggestion`;
// export const DOUBT_QUERY_RESULTS_API = `${process.env.REACT_APP_HOST_IDENTIFIER}/api/as/v1/engines/doubt-forum-engine/search`;
export const META_QUERY_API = `${process.env.REACT_APP_HOST_IDENTIFIER ?? 'https://a3d547560b4f411db9ce080474ff941d.ent-search.asia-south1.gcp.elastic-cloud.com'}/api/as/v1/engines/lecture-tags/query_suggestion`;
export const META_QUERY_RESULTS_API = `${process.env.REACT_APP_HOST_IDENTIFIER ?? 'https://a3d547560b4f411db9ce080474ff941d.ent-search.asia-south1.gcp.elastic-cloud.com'}/api/as/v1/engines/lecture-tags/search`;

export const regexExpression =
  /\bourselves\b|\bhers\b|\bbetween\b|\byourself\b|\bbut\b|\bagain\b|\bthere\b|\babout\b|\bonce\b|\bduring\b|\bout\b|\bvery\b|\bhaving\b|\bwith\b|\bthey\b|\bown\b|\ban\b|\bbe\b|\bsome\b|\bfor\b|\bdo\b|\bits\b|\byours\b|\bsuch\b|\binto\b|\bof\b|\bmost\b|\bitself\b|\bother\b|\boff\b|\bs\b|\bam\b|\bor\b|\bwho\b|\bas\b|\bfrom\b|\bhim\b|\beach\b|\bthe\b|\bthemselves\b|\buntil\b|\bbelow\b|\bare\b|\bwe\b|\bthese\b|\byour\b|\bhis\b|\bthrough\b|\bdon\b|\bnor\b|\bme\b|\bwere\b|\bher\b|\bmore\b|\bhimself\b|\bthis\b|\bdown\b|\bshould\b|\bour\b|\btheir\b|\bwhile\b|\babove\b|\bboth\b|\bup\b|\bto\b|\bours\b|\bhad\b|\bshe\b|\ball\b|\bno\b|\bwhen\b|\bat\b|\bany\b|\bbefore\b|\bthem\b|\bsame\b|\band\b|\bbeen\b|\bhave\b|\bin\b|\bwill\b|\bon\b|\bdoes\b|\byourselves\b|\bthen\b|\bthat\b|\bbecause\b|\bwhat\b|\bover\b|\bwhy\b|\bso\b|\bcan\b|\bdid\b|\bnot\b|\bnow\b|\bunder\b|\bhe\b|\byou\b|\bherself\b|\bhas\b|\bjust\b|\bwhere\b|\btoo\b|\bonly\b|\bmyself\b|\bwhich\b|\bthose\b|\bi\b|\bafter\b|\bfew\b|\bwhom\b|\bt\b|\bbeing\b|\bif\b|\btheirs\b|\bmy\b|\bagainst\b|\ba\b|\bby\b|\bdoing\b|\bit\b|\bhow\b|\bfurther\b|\bwas\b|\bhere\b|\bthan\b|\bis\b/;

export const elasticHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.REACT_APP_SEARCH_KEY ?? 'search-ooxckca2qmm2movhqtyuenws'}`,
};
