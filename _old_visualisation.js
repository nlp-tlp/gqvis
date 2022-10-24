/* Code found here:

https://observablehq.com/@brunolaranjeira/d3-v6-force-directed-graph-with-directional-straight-arrow
https://bl.ocks.org/mbostock/4062045
https://github.com/nlp-tlp/aquila/blob/master/views/visualisations/entity_linking_graph.jade
https://observablehq.com/@harrylove/draw-an-arrowhead-marker-connected-to-a-line-in-d3

*/

// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function lightenDarkenColor(col, amt) {
  let usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  let num = parseInt(col, 16);

  let r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

let drag = (simulation) => {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

const scale = d3.scaleOrdinal(d3.schemeCategory10);

const nodeSize = 40;

let height = 600;
let width = 600;

let data = {
  nodes: [
    { id: "Myriel", group: 1 },
    { id: "Napoleon", group: 1 },
    { id: "Mlle.Baptistine", group: 1 },
    { id: "Mme.Magloire", group: 1 },
    { id: "CountessdeLo", group: 1 },
    { id: "Geborand", group: 1 },
    { id: "Champtercier", group: 1 },
    { id: "Cravatte", group: 1 },
    { id: "Count", group: 1 },
    { id: "OldMan", group: 1 },
    { id: "Labarre", group: 2 },
    { id: "Valjean", group: 2 },
    { id: "Marguerite", group: 3 },
    { id: "Mme.deR", group: 2 },
    { id: "Isabeau", group: 2 },
    { id: "Gervais", group: 2 },
    { id: "Tholomyes", group: 3 },
    { id: "Listolier", group: 3 },
    { id: "Fameuil", group: 3 },
    { id: "Blacheville", group: 3 },
    { id: "Favourite", group: 3 },
    { id: "Dahlia", group: 3 },
    { id: "Zephine", group: 3 },
    { id: "Fantine", group: 3 },
    { id: "Mme.Thenardier", group: 4 },
    { id: "Thenardier", group: 4 },
    { id: "Cosette", group: 5 },
    { id: "Javert", group: 4 },
    { id: "Fauchelevent", group: 0 },
    { id: "Bamatabois", group: 2 },
    { id: "Perpetue", group: 3 },
    { id: "Simplice", group: 2 },
    { id: "Scaufflaire", group: 2 },
    { id: "Woman1", group: 2 },
    { id: "Judge", group: 2 },
    { id: "Champmathieu", group: 2 },
    { id: "Brevet", group: 2 },
    { id: "Chenildieu", group: 2 },
    { id: "Cochepaille", group: 2 },
    { id: "Pontmercy", group: 4 },
    { id: "Boulatruelle", group: 6 },
    { id: "Eponine", group: 4 },
    { id: "Anzelma", group: 4 },
    { id: "Woman2", group: 5 },
    { id: "MotherInnocent", group: 0 },
    { id: "Gribier", group: 0 },
    { id: "Jondrette", group: 7 },
    { id: "Mme.Burgon", group: 7 },
    { id: "Gavroche", group: 8 },
    { id: "Gillenormand", group: 5 },
    { id: "Magnon", group: 5 },
    { id: "Mlle.Gillenormand", group: 5 },
    { id: "Mme.Pontmercy", group: 5 },
    { id: "Mlle.Vaubois", group: 5 },
    { id: "Lt.Gillenormand", group: 5 },
    { id: "Marius", group: 8 },
    { id: "BaronessT", group: 5 },
    { id: "Mabeuf", group: 8 },
    { id: "Enjolras", group: 8 },
    { id: "Combeferre", group: 8 },
    { id: "Prouvaire", group: 8 },
    { id: "Feuilly", group: 8 },
    { id: "Courfeyrac", group: 8 },
    { id: "Bahorel", group: 8 },
    { id: "Bossuet", group: 8 },
    { id: "Joly", group: 8 },
    { id: "Grantaire", group: 8 },
    { id: "MotherPlutarch", group: 9 },
    { id: "Gueulemer", group: 4 },
    { id: "Babet", group: 4 },
    { id: "Claquesous", group: 4 },
    { id: "Montparnasse", group: 4 },
    { id: "Toussaint", group: 5 },
    { id: "Child1", group: 10 },
    { id: "Child2", group: 10 },
    { id: "Brujon", group: 4 },
    { id: "Mme.Hucheloup", group: 8 },
  ],
  links: [
    { source: "Napoleon", target: "Myriel", value: 1 },
    { source: "Mlle.Baptistine", target: "Myriel", value: 8 },
    { source: "Mme.Magloire", target: "Myriel", value: 10 },
    { source: "Mme.Magloire", target: "Mlle.Baptistine", value: 6 },
    { source: "CountessdeLo", target: "Myriel", value: 1 },
    { source: "Geborand", target: "Myriel", value: 1 },
    { source: "Champtercier", target: "Myriel", value: 1 },
    { source: "Cravatte", target: "Myriel", value: 1 },
    { source: "Count", target: "Myriel", value: 2 },
    { source: "OldMan", target: "Myriel", value: 1 },
    { source: "Valjean", target: "Labarre", value: 1 },
    { source: "Valjean", target: "Mme.Magloire", value: 3 },
    { source: "Valjean", target: "Mlle.Baptistine", value: 3 },
    { source: "Valjean", target: "Myriel", value: 5 },
    { source: "Marguerite", target: "Valjean", value: 1 },
    { source: "Mme.deR", target: "Valjean", value: 1 },
    { source: "Isabeau", target: "Valjean", value: 1 },
    { source: "Gervais", target: "Valjean", value: 1 },
    { source: "Listolier", target: "Tholomyes", value: 4 },
    { source: "Fameuil", target: "Tholomyes", value: 4 },
    { source: "Fameuil", target: "Listolier", value: 4 },
    { source: "Blacheville", target: "Tholomyes", value: 4 },
    { source: "Blacheville", target: "Listolier", value: 4 },
    { source: "Blacheville", target: "Fameuil", value: 4 },
    { source: "Favourite", target: "Tholomyes", value: 3 },
    { source: "Favourite", target: "Listolier", value: 3 },
    { source: "Favourite", target: "Fameuil", value: 3 },
    { source: "Favourite", target: "Blacheville", value: 4 },
    { source: "Dahlia", target: "Tholomyes", value: 3 },
    { source: "Dahlia", target: "Listolier", value: 3 },
    { source: "Dahlia", target: "Fameuil", value: 3 },
    { source: "Dahlia", target: "Blacheville", value: 3 },
    { source: "Dahlia", target: "Favourite", value: 5 },
    { source: "Zephine", target: "Tholomyes", value: 3 },
    { source: "Zephine", target: "Listolier", value: 3 },
    { source: "Zephine", target: "Fameuil", value: 3 },
    { source: "Zephine", target: "Blacheville", value: 3 },
    { source: "Zephine", target: "Favourite", value: 4 },
    { source: "Zephine", target: "Dahlia", value: 4 },
    { source: "Fantine", target: "Tholomyes", value: 3 },
    { source: "Fantine", target: "Listolier", value: 3 },
    { source: "Fantine", target: "Fameuil", value: 3 },
    { source: "Fantine", target: "Blacheville", value: 3 },
    { source: "Fantine", target: "Favourite", value: 4 },
    { source: "Fantine", target: "Dahlia", value: 4 },
    { source: "Fantine", target: "Zephine", value: 4 },
    { source: "Fantine", target: "Marguerite", value: 2 },
    { source: "Fantine", target: "Valjean", value: 9 },
    { source: "Mme.Thenardier", target: "Fantine", value: 2 },
    { source: "Mme.Thenardier", target: "Valjean", value: 7 },
    { source: "Thenardier", target: "Mme.Thenardier", value: 13 },
    { source: "Thenardier", target: "Fantine", value: 1 },
    { source: "Thenardier", target: "Valjean", value: 12 },
    { source: "Cosette", target: "Mme.Thenardier", value: 4 },
    { source: "Cosette", target: "Valjean", value: 31 },
    { source: "Cosette", target: "Tholomyes", value: 1 },
    { source: "Cosette", target: "Thenardier", value: 1 },
    { source: "Javert", target: "Valjean", value: 17 },
    { source: "Javert", target: "Fantine", value: 5 },
    { source: "Javert", target: "Thenardier", value: 5 },
    { source: "Javert", target: "Mme.Thenardier", value: 1 },
    { source: "Javert", target: "Cosette", value: 1 },
    { source: "Fauchelevent", target: "Valjean", value: 8 },
    { source: "Fauchelevent", target: "Javert", value: 1 },
    { source: "Bamatabois", target: "Fantine", value: 1 },
    { source: "Bamatabois", target: "Javert", value: 1 },
    { source: "Bamatabois", target: "Valjean", value: 2 },
    { source: "Perpetue", target: "Fantine", value: 1 },
    { source: "Simplice", target: "Perpetue", value: 2 },
    { source: "Simplice", target: "Valjean", value: 3 },
    { source: "Simplice", target: "Fantine", value: 2 },
    { source: "Simplice", target: "Javert", value: 1 },
    { source: "Scaufflaire", target: "Valjean", value: 1 },
    { source: "Woman1", target: "Valjean", value: 2 },
    { source: "Woman1", target: "Javert", value: 1 },
    { source: "Judge", target: "Valjean", value: 3 },
    { source: "Judge", target: "Bamatabois", value: 2 },
    { source: "Champmathieu", target: "Valjean", value: 3 },
    { source: "Champmathieu", target: "Judge", value: 3 },
    { source: "Champmathieu", target: "Bamatabois", value: 2 },
    { source: "Brevet", target: "Judge", value: 2 },
    { source: "Brevet", target: "Champmathieu", value: 2 },
    { source: "Brevet", target: "Valjean", value: 2 },
    { source: "Brevet", target: "Bamatabois", value: 1 },
    { source: "Chenildieu", target: "Judge", value: 2 },
    { source: "Chenildieu", target: "Champmathieu", value: 2 },
    { source: "Chenildieu", target: "Brevet", value: 2 },
    { source: "Chenildieu", target: "Valjean", value: 2 },
    { source: "Chenildieu", target: "Bamatabois", value: 1 },
    { source: "Cochepaille", target: "Judge", value: 2 },
    { source: "Cochepaille", target: "Champmathieu", value: 2 },
    { source: "Cochepaille", target: "Brevet", value: 2 },
    { source: "Cochepaille", target: "Chenildieu", value: 2 },
    { source: "Cochepaille", target: "Valjean", value: 2 },
    { source: "Cochepaille", target: "Bamatabois", value: 1 },
    { source: "Pontmercy", target: "Thenardier", value: 1 },
    { source: "Boulatruelle", target: "Thenardier", value: 1 },
    { source: "Eponine", target: "Mme.Thenardier", value: 2 },
    { source: "Eponine", target: "Thenardier", value: 3 },
    { source: "Anzelma", target: "Eponine", value: 2 },
    { source: "Anzelma", target: "Thenardier", value: 2 },
    { source: "Anzelma", target: "Mme.Thenardier", value: 1 },
    { source: "Woman2", target: "Valjean", value: 3 },
    { source: "Woman2", target: "Cosette", value: 1 },
    { source: "Woman2", target: "Javert", value: 1 },
    { source: "MotherInnocent", target: "Fauchelevent", value: 3 },
    { source: "MotherInnocent", target: "Valjean", value: 1 },
    { source: "Gribier", target: "Fauchelevent", value: 2 },
    { source: "Mme.Burgon", target: "Jondrette", value: 1 },
    { source: "Gavroche", target: "Mme.Burgon", value: 2 },
    { source: "Gavroche", target: "Thenardier", value: 1 },
    { source: "Gavroche", target: "Javert", value: 1 },
    { source: "Gavroche", target: "Valjean", value: 1 },
    { source: "Gillenormand", target: "Cosette", value: 3 },
    { source: "Gillenormand", target: "Valjean", value: 2 },
    { source: "Magnon", target: "Gillenormand", value: 1 },
    { source: "Magnon", target: "Mme.Thenardier", value: 1 },
    { source: "Mlle.Gillenormand", target: "Gillenormand", value: 9 },
    { source: "Mlle.Gillenormand", target: "Cosette", value: 2 },
    { source: "Mlle.Gillenormand", target: "Valjean", value: 2 },
    { source: "Mme.Pontmercy", target: "Mlle.Gillenormand", value: 1 },
    { source: "Mme.Pontmercy", target: "Pontmercy", value: 1 },
    { source: "Mlle.Vaubois", target: "Mlle.Gillenormand", value: 1 },
    { source: "Lt.Gillenormand", target: "Mlle.Gillenormand", value: 2 },
    { source: "Lt.Gillenormand", target: "Gillenormand", value: 1 },
    { source: "Lt.Gillenormand", target: "Cosette", value: 1 },
    { source: "Marius", target: "Mlle.Gillenormand", value: 6 },
    { source: "Marius", target: "Gillenormand", value: 12 },
    { source: "Marius", target: "Pontmercy", value: 1 },
    { source: "Marius", target: "Lt.Gillenormand", value: 1 },
    { source: "Marius", target: "Cosette", value: 21 },
    { source: "Marius", target: "Valjean", value: 19 },
    { source: "Marius", target: "Tholomyes", value: 1 },
    { source: "Marius", target: "Thenardier", value: 2 },
    { source: "Marius", target: "Eponine", value: 5 },
    { source: "Marius", target: "Gavroche", value: 4 },
    { source: "BaronessT", target: "Gillenormand", value: 1 },
    { source: "BaronessT", target: "Marius", value: 1 },
    { source: "Mabeuf", target: "Marius", value: 1 },
    { source: "Mabeuf", target: "Eponine", value: 1 },
    { source: "Mabeuf", target: "Gavroche", value: 1 },
    { source: "Enjolras", target: "Marius", value: 7 },
    { source: "Enjolras", target: "Gavroche", value: 7 },
    { source: "Enjolras", target: "Javert", value: 6 },
    { source: "Enjolras", target: "Mabeuf", value: 1 },
    { source: "Enjolras", target: "Valjean", value: 4 },
    { source: "Combeferre", target: "Enjolras", value: 15 },
    { source: "Combeferre", target: "Marius", value: 5 },
    { source: "Combeferre", target: "Gavroche", value: 6 },
    { source: "Combeferre", target: "Mabeuf", value: 2 },
    { source: "Prouvaire", target: "Gavroche", value: 1 },
    { source: "Prouvaire", target: "Enjolras", value: 4 },
    { source: "Prouvaire", target: "Combeferre", value: 2 },
    { source: "Feuilly", target: "Gavroche", value: 2 },
    { source: "Feuilly", target: "Enjolras", value: 6 },
    { source: "Feuilly", target: "Prouvaire", value: 2 },
    { source: "Feuilly", target: "Combeferre", value: 5 },
    { source: "Feuilly", target: "Mabeuf", value: 1 },
    { source: "Feuilly", target: "Marius", value: 1 },
    { source: "Courfeyrac", target: "Marius", value: 9 },
    { source: "Courfeyrac", target: "Enjolras", value: 17 },
    { source: "Courfeyrac", target: "Combeferre", value: 13 },
    { source: "Courfeyrac", target: "Gavroche", value: 7 },
    { source: "Courfeyrac", target: "Mabeuf", value: 2 },
    { source: "Courfeyrac", target: "Eponine", value: 1 },
    { source: "Courfeyrac", target: "Feuilly", value: 6 },
    { source: "Courfeyrac", target: "Prouvaire", value: 3 },
    { source: "Bahorel", target: "Combeferre", value: 5 },
    { source: "Bahorel", target: "Gavroche", value: 5 },
    { source: "Bahorel", target: "Courfeyrac", value: 6 },
    { source: "Bahorel", target: "Mabeuf", value: 2 },
    { source: "Bahorel", target: "Enjolras", value: 4 },
    { source: "Bahorel", target: "Feuilly", value: 3 },
    { source: "Bahorel", target: "Prouvaire", value: 2 },
    { source: "Bahorel", target: "Marius", value: 1 },
    { source: "Bossuet", target: "Marius", value: 5 },
    { source: "Bossuet", target: "Courfeyrac", value: 12 },
    { source: "Bossuet", target: "Gavroche", value: 5 },
    { source: "Bossuet", target: "Bahorel", value: 4 },
    { source: "Bossuet", target: "Enjolras", value: 10 },
    { source: "Bossuet", target: "Feuilly", value: 6 },
    { source: "Bossuet", target: "Prouvaire", value: 2 },
    { source: "Bossuet", target: "Combeferre", value: 9 },
    { source: "Bossuet", target: "Mabeuf", value: 1 },
    { source: "Bossuet", target: "Valjean", value: 1 },
    { source: "Joly", target: "Bahorel", value: 5 },
    { source: "Joly", target: "Bossuet", value: 7 },
    { source: "Joly", target: "Gavroche", value: 3 },
    { source: "Joly", target: "Courfeyrac", value: 5 },
    { source: "Joly", target: "Enjolras", value: 5 },
    { source: "Joly", target: "Feuilly", value: 5 },
    { source: "Joly", target: "Prouvaire", value: 2 },
    { source: "Joly", target: "Combeferre", value: 5 },
    { source: "Joly", target: "Mabeuf", value: 1 },
    { source: "Joly", target: "Marius", value: 2 },
    { source: "Grantaire", target: "Bossuet", value: 3 },
    { source: "Grantaire", target: "Enjolras", value: 3 },
    { source: "Grantaire", target: "Combeferre", value: 1 },
    { source: "Grantaire", target: "Courfeyrac", value: 2 },
    { source: "Grantaire", target: "Joly", value: 2 },
    { source: "Grantaire", target: "Gavroche", value: 1 },
    { source: "Grantaire", target: "Bahorel", value: 1 },
    { source: "Grantaire", target: "Feuilly", value: 1 },
    { source: "Grantaire", target: "Prouvaire", value: 1 },
    { source: "MotherPlutarch", target: "Mabeuf", value: 3 },
    { source: "Gueulemer", target: "Thenardier", value: 5 },
    { source: "Gueulemer", target: "Valjean", value: 1 },
    { source: "Gueulemer", target: "Mme.Thenardier", value: 1 },
    { source: "Gueulemer", target: "Javert", value: 1 },
    { source: "Gueulemer", target: "Gavroche", value: 1 },
    { source: "Gueulemer", target: "Eponine", value: 1 },
    { source: "Babet", target: "Thenardier", value: 6 },
    { source: "Babet", target: "Gueulemer", value: 6 },
    { source: "Babet", target: "Valjean", value: 1 },
    { source: "Babet", target: "Mme.Thenardier", value: 1 },
    { source: "Babet", target: "Javert", value: 2 },
    { source: "Babet", target: "Gavroche", value: 1 },
    { source: "Babet", target: "Eponine", value: 1 },
    { source: "Claquesous", target: "Thenardier", value: 4 },
    { source: "Claquesous", target: "Babet", value: 4 },
    { source: "Claquesous", target: "Gueulemer", value: 4 },
    { source: "Claquesous", target: "Valjean", value: 1 },
    { source: "Claquesous", target: "Mme.Thenardier", value: 1 },
    { source: "Claquesous", target: "Javert", value: 1 },
    { source: "Claquesous", target: "Eponine", value: 1 },
    { source: "Claquesous", target: "Enjolras", value: 1 },
    { source: "Montparnasse", target: "Javert", value: 1 },
    { source: "Montparnasse", target: "Babet", value: 2 },
    { source: "Montparnasse", target: "Gueulemer", value: 2 },
    { source: "Montparnasse", target: "Claquesous", value: 2 },
    { source: "Montparnasse", target: "Valjean", value: 1 },
    { source: "Montparnasse", target: "Gavroche", value: 1 },
    { source: "Montparnasse", target: "Eponine", value: 1 },
    { source: "Montparnasse", target: "Thenardier", value: 1 },
    { source: "Toussaint", target: "Cosette", value: 2 },
    { source: "Toussaint", target: "Javert", value: 1 },
    { source: "Toussaint", target: "Valjean", value: 1 },
    { source: "Child1", target: "Gavroche", value: 2 },
    { source: "Child2", target: "Gavroche", value: 2 },
    { source: "Child2", target: "Child1", value: 3 },
    { source: "Brujon", target: "Babet", value: 3 },
    { source: "Brujon", target: "Gueulemer", value: 3 },
    { source: "Brujon", target: "Thenardier", value: 3 },
    { source: "Brujon", target: "Gavroche", value: 1 },
    { source: "Brujon", target: "Eponine", value: 1 },
    { source: "Brujon", target: "Claquesous", value: 1 },
    { source: "Brujon", target: "Montparnasse", value: 1 },
    { source: "Mme.Hucheloup", target: "Bossuet", value: 1 },
    { source: "Mme.Hucheloup", target: "Joly", value: 1 },
    { source: "Mme.Hucheloup", target: "Grantaire", value: 1 },
    { source: "Mme.Hucheloup", target: "Bahorel", value: 1 },
    { source: "Mme.Hucheloup", target: "Courfeyrac", value: 1 },
    { source: "Mme.Hucheloup", target: "Gavroche", value: 1 },
    { source: "Mme.Hucheloup", target: "Enjolras", value: 1 },
  ],
};

const links = data.links.map((d) => Object.create(d));
const nodes = data.nodes.map((d) => Object.create(d));

const colours = [
  "#99ffcc",
  "#ffcccc",
  "#ccccff",
  "#ccff99",
  "#ccffcc",
  "#ccffff",
  "#ffcc99",
  "#ffccff",
  "#ffff99",
  "#ffffcc",
  "#cccc99",
  "#fbafff",
];

function loadColourMap(nodes) {
  let colourMap = {};
  // Load the colour map
  for (let i = 0; i < nodes.length; i++) {
    const group = nodes[i].group;
    if (!(group in colourMap)) {
      colourMap[group] =
        colours[Object.keys(colourMap).length % colours.length];
    }
  }
  return colourMap;
}
colourMap = loadColourMap(nodes);

const getColour = (d) => {
  return colourMap[d.group];
};
console.log(colourMap);

// const simulation = d3.forceSimulation(nodes)
//   .force("link", d3.forceLink(links).id(d => d.id))
//   .force("charge", d3.forceManyBody())
//   .force("center", d3.forceCenter(width / 2, height / 2))

const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3.forceLink(links).id((d) => d.id)
  )
  .force("charge", d3.forceManyBody().strength(-300))
  // .force("x", d3.forceX())
  // .force("y", d3.forceY())
  .force(
    "collide",
    d3.forceCollide((d) => nodeSize * 1.5)
  )
  .force("center", d3.forceCenter(width / 2, height / 2));

const svg = d3.select("#chart").attr("viewBox", [0, 0, width, height]);

// svg_g: The 'g' within svg, which seems to make zooming/panning smoother
const svg_g = svg.append("g");

const defs = svg_g.append("defs");

/*
const link = svg_g
  .append("g")
  //.attr("fill", "none")
  // .attr("stroke", "#999")
  // .attr("stroke-opacity", 0.6)

  .selectAll("path")
  .data(links)
  .join("path")
  .attr("stroke-width", 2)
  .attr("stroke", "#333333"); //stroke("#222")
//.attr("stroke-width", (d) => 2)
//.attr("marker-end", (d) => `url(${new URL(`#arrow-1`, location)})`); //Math.sqrt(d.value));

 */

const marker = defs
  .selectAll("marker")
  .data(["type_1"])
  .enter()
  .append("svg:marker")
  .attr("id", function (d, i) {
    return `marker_${i}`;
  })
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", nodeSize + 3)
  .attr("refY", 0)
  .attr("markerWidth", 6)
  .attr("markerHeight", 6)
  .attr("orient", "auto")
  .append("svg:path")
  .attr("fill", "#444")
  .attr("d", "M0,-5L10,0L0,5");

const link = svg_g
  .append("g")
  .attr("id", "links")
  .attr("fill", "none")
  .attr("stroke-width", 1.5)
  .selectAll("path")
  .data(links)
  .enter()
  .append("path")
  .attr("stroke", "#444")
  .attr("stroke-width", 2)
  .attr("marker-end", function (d, i) {
    return `url("#marker_0")`;
  })
  .attr(
    "d",
    (d) => `M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
  );

const node = svg_g
  .append("g")
  .attr("stroke-width", 3)
  .selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("r", nodeSize)
  .attr("fill", getColour)
  .attr("stroke", function (d) {
    return lightenDarkenColor(getColour(d), -15);
  })
  .call(drag(simulation));

// node.append("title")
//   .text(d => d.id)

const text = svg_g
  .append("g")
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .attr("x", 30 + 4)
  .attr("y", "0.31em")
  .text((d) => d.id)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "central");

// .clone(true).lower()
// .attr("fill", "none")
// .attr("stroke", "black")
// .attr("stroke-width", 3);

simulation.on("tick", () => {
  // link
  //   .attr("x1", (d) => d.source.x)
  //   .attr("y1", (d) => d.source.y)
  //   .attr("x2", (d) => d.target.x)
  //   .attr("y2", (d) => d.target.y);

  link.attr(
    "d",
    (d) => `M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
  );

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  text.attr("x", (d) => d.x).attr("y", (d) => d.y);
});

let zoom = d3.zoom().on("zoom", handleZoom);

function handleZoom(e) {
  d3.select("svg g").attr("transform", e.transform);
  console.log(e);
  d3.selectAll("text").attr("font-size", Math.round(12 / e.transform.k));
}

function initZoom() {
  d3.select("svg").call(zoom);
}

initZoom();
