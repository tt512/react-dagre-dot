import React from "react";
import PropTypes from "prop-types";
import * as dagreD3 from "dagre-d3";
import * as d3 from "d3";
import graphlibDot from "graphlib-dot";

const css = `
.node rect,
.node circle,
.node ellipse {
  stroke: #333;
  fill: #fff;
  stroke-width: 1.5px;
}

.cluster rect {
  stroke: #333;
  fill: #000;
  fill-opacity: 0.1;
  stroke-width: 1.5px;
}

.edgePath path.path {
  stroke: #333;
  stroke-width: 1.5px;
  fill: none;
}`;

const render = dagreD3.render();

const renderError = (parent, message) => {
  parent
    .append("text")
    .attr("x", 10)
    .attr("y", 10)
    .attr("font-size", "14px")
    .attr("fill", "red")
    .text(message);
};

class DagreDot extends React.Component {
  constructor(props) {
    super(props);
    this.graph = React.createRef();
  }

  componentDidMount() {
    this.renderGraph();
  }

  componentDidUpdate() {
    this.renderGraph();
  }

  renderGraph() {
    const { dot, fit, padding: p } = this.props;
    const svg = this.graph.current;
    const g = d3.select(svg).append("g");
    let graph;
    try {
      graph = graphlibDot.read(dot);
    } catch (e) {
      renderError(g, e.message);
      return;
    }
    render(g, graph);

    const { width: pw, height: ph } = this.props;
    const { width: gw, height: gh } = graph.graph();
    const w = pw === 0 ? gw : pw;
    const h = ph === 0 ? gh : ph;
    const { vw, vh } = fit ? { vw: gw, vh: gh } : { vw: w, vh: h };
    d3.select(svg)
      .attr("width", w + p * 2)
      .attr("height", h + p * 2)
      .attr("viewBox", `${-p} ${-p} ${vw + p * 2} ${vh + p * 2}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
  }

  render() {
    const { width, height } = this.props;
    return (
      <svg ref={this.graph} width={width} height={height}>
        <style type="text/css">{css}</style>
      </svg>
    );
  }
}

DagreDot.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  fit: PropTypes.bool,
  dot: PropTypes.string.isRequired
};

DagreDot.defaultProps = {
  width: 0,
  height: 0,
  padding: 3,
  fit: false
};

export default DagreDot;
