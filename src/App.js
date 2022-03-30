import React from "react";
import logo from './logo.svg';
import './App.css';
import Node from "./Node";
import Heap from "./Heap";

const END_COLOR = "#ff00ff";
const SEARCH_COLOR = "#ff0000";
const PATH_COLOR = "#00ffff";

let startPos = [0,0]
let nextStartPos = null
let endPos = [9, 9]
let nextEndPos = null

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      onMouseEnter={props.onEnter}
      style={props.style ?? { height: "50px", width: "50px", background: props.color}}
    >
      {props.node.FCost === Infinity ? '' : ''}
      {props.label}
    </button>
  );
}
function Run(props){
  return(
    <button 
      className = "Run"
      onClick = {props.onClick}
    >
    {props.text}
    </button>
  )
}

function Label(props){
  return(
    <p
      style = {
        { 
          position: "relative",
          height: "30px",
          width: "320px",
          fontSize: "20px",
          paddingTop:"10px",
          paddingLeft: "10px",
          //marginTop:"-40px",
          marginRight: "auto",
          marginBottom: "0",
          textAlign:"left",
          color: "#ffffff",
          //background: "#000000",
          //: "10px",
        }
      }
      >
        {props.text}
  </p>
  )
}
//{"1. Click the red node to change the starting node."}
       //{"2. Click the pink node to change the target node."}
class Board extends React.Component {
  constructor(props) {
    super(props);

    var newNodes = [];
    for (let i = 0; i < props.size_x; ++i) {
      let rowNodes = [];
      for (let j = 0; j < props.size_y; ++j) {
        let newNode = new Node([i, j]);
        newNode.Neighbors = newNode.GetNeighbors(props.size_x-1, props.size_y-1);
        rowNodes[j] = newNode; //
      }
      newNodes[i] = rowNodes;
    }

    this.state = {
      newDOM: Array(props.size_x * 2),
      nodes: newNodes,
      startNode: startPos,
      endNode: endPos,
      mode: 0,
      size_x: props.size_x,
      size_y: props.size_y,
      runText: "Run!",
    };
    this.state = this.genBoard(this.state);
  }

  genBoard(state){
    var DOM = [];
    var x = [];
    var reset = state.runText === "0";

    for (let i = 0; i < this.props.size_x; ++i) {
      DOM.push(<div></div>);
      let rowNodes = [];
      for (let j = 0; j < this.props.size_y; ++j) {
        let node = state.nodes[i][j];
        //let newNode = new Node([i, j])
        let newColor = "#ffffff";
        if(reset){
          node.Closed = false;
          node.Path = false;
          node.n = null;
          node.P = null;
          node.L = null;
          node.R = null;
          node.Parent = null;
          node.GCost = Infinity;
          node.HCost = Infinity;
          node.FCost = Infinity;
        }
        if (node.Path){
          newColor = PATH_COLOR;
        } else if (i === startPos[0] && j === startPos[1]){
          newColor = SEARCH_COLOR;
        } else if (i === endPos[0] && j === endPos[1]){
          newColor = END_COLOR;
        } else if (nextStartPos  && i === nextStartPos[0] && j === nextStartPos[1]){
          newColor = SEARCH_COLOR;
        } else if (nextEndPos  && i === nextEndPos[0] && j === nextEndPos[1]){
          newColor = END_COLOR;
        } else if (node.Traversable === false){
          newColor = "#000000";
        } else if (node.Closed === true){
          newColor = SEARCH_COLOR;
        } 
        
        

        let squareDOM = (
          <Square
            onClick={() => this.squareClick([i, j])}
            onEnter ={()=> this.squareOver([i,j])}
            color={newColor}
            node = {node}
          />
        );
        DOM.push(squareDOM);
        rowNodes[j] = node;
      }
      x[i] = rowNodes;
    }
    //console.log(this.state.mode)
    if(reset){
      state.runText = "Run!";
      state.mode = 0;
    }

    return({
      newDOM: DOM,
      nodes: x,
      startNode: startPos,
      endNode: endPos,
      mode: state.mode,
      runText: state.runText,
    });
  }

  squareClick(Position) {
    //console.log(Position);
    var newState = this.genBoard(this.state);
    var nodes = newState.nodes;
    var node = nodes[Position[0]][Position[1]];
    var mode = 0; //0 -> to black node; 1 -> change start node; 2 -> change end node

    var isEnd = Position[0] === endPos[0] && Position[1] === endPos[1];  
    var isStart = Position[0] === startPos[0] && Position[1] === startPos[1]
  
    switch(newState.mode){
      case 1:
        if (!isEnd){
          let oldNode = nodes[startPos[0]][startPos[1]];
          oldNode.Closed = false;
          oldNode.Traversable = true;
          startPos = Position;
        } else {
          mode = 1;
        }
        break;
      case 2:
        if (!isStart){
          let oldNode = nodes[endPos[0]][endPos[1]];
          oldNode.Closed = false;
          oldNode.Traversable = true;
          endPos = Position;
        } else {
          mode = 2;
        }
        break;
      case 3:
        mode = 3;
        break;
      case -1:
        return;
      default:
        break;
    }
    
    if (newState.mode === 0){
      if (isStart){
        mode = 1;
      } else if (isEnd){
        mode = 2;
      } else if (newState.mode === 0) {
        mode = 0;
        node.Traversable = !node.Traversable;
      }
    }

    newState.mode = mode;

    newState = this.genBoard(newState)
    
    this.setState(newState);
    
  }

  squareOver(Position) {
    var newState = this.genBoard(this.state);

    var isStart = Position[0] === startPos[0] && Position[1] === startPos[1];
    var isEnd = Position[0] === endPos[0] && Position[1] === endPos[1];

    if (newState.mode === 1 && !isStart){
      nextStartPos = Position;
    } else if (newState.mode === 2 && !isEnd){
      nextEndPos = Position;
    }

    newState = this.genBoard(newState);
    this.setState(newState);
  }

  runClick(){
    var newState = this.genBoard(this.state)
    var nodes = newState.nodes;

    if (newState.mode !== 0 && newState.mode !== 3){
      return;
    } else if (newState.mode === 3){
      newState.runText = "0";
      newState = this.genBoard(newState);
      this.setState(newState);
      return;
    }
    newState.runText = "Reset";
    newState.mode = -1;

    var open = new Heap();
    var closed = [];

    var startNode = nodes[startPos[0]][startPos[1]];
    startNode.Traversable = true;

    var endNode = nodes[endPos[0]][endPos[1]];
    endNode.Traversable = true;

    var current = startNode;
    
    //open.sort((a, b)=> a - b)
    open.Append(startNode);
    

    //console.log(JSON.parse(JSON.stringify(newState)));
    newState = this.genBoard(newState);
    this.setState(newState);
    let isTarget = current.Position[0] === endPos[0] && current.Position[1] === endPos[1];
    while(open.arr[0]){
      //open.sort((a, b)=> a - b)
      current = open.arr[0];
      
      isTarget = current.Position[0] === endPos[0] && current.Position[1] === endPos[1];
      if (isTarget)
        break; 
      
      
      open.Remove();
      closed.push(current);
      current.Closed = true;
      
      for(let neighborPos of current.Neighbors){
        let neighbor = nodes[neighborPos[0]][neighborPos[1]];
        //console.log(neighborPos);
        if (neighbor.Traversable && !(neighbor.Closed)){
          let neighborClone = neighbor.clone();
          neighborClone.Parent = current;
          let newDistance = neighborClone.CalcG(0);
          
          let inOpen = open.arr.includes(neighbor);
          
          if(newDistance < neighbor.GCost || !inOpen){
            neighbor.GCost = newDistance;
            neighbor.HCost = neighbor.CalcH(endNode);
            neighbor.FCost = neighbor.GCost + neighbor.HCost;
            neighbor.Parent = current;

            if (!inOpen)
              open.Append(neighbor);
          }
          
        }
        
      }
      
    }

    if(isTarget)
      current.Trace();
    newState.mode = 3;
    newState = this.genBoard(newState);
    this.setState(newState);


  }

  render() {
    return (
      <div
        className="Board">
        <div className = "Grid">
          {this.state.newDOM}
        </div>
        <Run onClick = {() => this.runClick() } text = {this.state.runText}/>
        <div style = {{
            background: "#ffb4f7",
            position: "relative",
            height: "510px",
            width: "350px",
            marginTop:"-600px",
            marginLeft:"auto",
            marginRight:"100px",
          }}>
          <Square 
          node = {new Node()} 
          style = {
            { 
              position: "relative",
              height: "50px",
              width: "50px",
              background: SEARCH_COLOR,
              marginTop:"10px",
              marginRight: "280px",
            }
          
          }
          />
          <p
              style = {
                { 
                  position: "relative",
                  height: "30px",
                  width: "200px",
                  fontSize: "24px",
                  paddingTop:"0px",
                  marginTop:"-40px",
                  marginLeft: "75px",
                  marginBottom: "0",
                  textAlign:"left",
                  color: "#ffffff",
                  //background: "#000000",
                  //: "10px",
                }
              }
              >
                Searched nodes
          </p>
          <Square 
          node = {new Node()} 
          style = {
            { 
              position: "relative",
              height: "50px",
              width: "50px",
              background: END_COLOR,
              marginTop:"20px",
              marginRight: "280px",
            }
          
          }
          />
          <p
            style = {
              { 
                position: "relative",
                height: "30px",
                width: "200px",
                fontSize: "24px",
                paddingTop:"0px",
                marginTop:"-40px",
                marginLeft: "75px",
                marginBottom: "0",
                textAlign:"left",
                color: "#ffffff",
                //background: "#000000",
                //: "10px",
              }
            }
            >
              Target node
          </p>
          <Square 
          node = {new Node()} 
          style = {
            { 
              position: "relative",
              height: "50px",
              width: "50px",
              background: "#ffffff",
              marginTop:"20px",
              marginRight: "280px",
            }
          
          }
          />
          <p
            style = {
              { 
                position: "relative",
                height: "30px",
                width: "200px",
                fontSize: "24px",
                paddingTop:"0px",
                marginTop:"-40px",
                marginLeft: "75px",
                marginBottom: "0",
                textAlign:"left",
                color: "#ffffff",
                //background: "#000000",
                //: "10px",
              }
            }
            >
              Traversable
          </p> 
          <Square 
          node = {new Node()} 
          style = {
            { 
              position: "relative",
              height: "50px",
              width: "50px",
              background: "#000000",
              marginTop:"20px",
              marginRight: "280px",
            }
          
          }
          />
          <p
            style = {
              { 
                position: "relative",
                height: "30px",
                width: "200px",
                fontSize: "24px",
                paddingTop:"0px",
                marginTop:"-40px",
                marginLeft: "75px",
                marginBottom: "0",
                textAlign:"left",
                color: "#ffffff",
                //background: "#000000",
                //: "10px",
              }
            }
            >
              Non traversable
          </p>
          <Square 
          node = {new Node()} 
          style = {
            { 
              position: "relative",
              height: "50px",
              width: "50px",
              background: PATH_COLOR,
              marginTop:"20px",
              marginRight: "280px",
            }
          
          }
          />
          <p
            style = {
              { 
                position: "relative",
                height: "30px",
                width: "200px",
                fontSize: "24px",
                paddingTop:"0px",
                marginTop:"-40px",
                marginLeft: "75px",
                marginBottom: "0",
                textAlign:"left",
                color: "#ffffff",
                //background: "#000000",
                //: "10px",
              }
            }
            >
              Path
          </p> 
        </div>
        <div style = {{
            background: "#ffb4f7",
            position: "relative",
            height: "510px",
            width: "350px",
            marginTop:"-510px",
            marginLeft:"100px",
            marginRight:"auto",
          }}>
            <Label 
            text = "1. Click the red node to change the starting node.">
            </Label>
            <Label 
            text = "2. Click the pink node to change the target node.">
            </Label>
            <Label 
            text = "3. Click any other node to change its traversability.">
            </Label>
            <Label 
            text = "4. Click 'Run!' to find the shortest path.">
            </Label>
          </div>

      </div>
      
    );
  }
}

function App() {
  return (
    <div className="App">
      <h1>A* Pathfinding</h1>
      <body className = "Body"> 
        <Board size_x={10} size_y={10} />
      </body>
    </div>
  );
}

export default App;
