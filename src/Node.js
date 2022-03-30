function clone(instance) {
    return Object.assign(
      Object.create(
        // Set the prototype of the new object to the prototype of the instance.
        // Used to allow new object behave like class instance.
        Object.getPrototypeOf(instance)
      ),
      // Prevent shallow copies of nested structures like arrays, etc
      JSON.parse(JSON.stringify(instance))
    );
  }
  
  function Magnitude(x){
    x = x.map((a) => a*a);
    var sum = 0;
    for(let v of x){
      sum = sum + v;
    }
  
    return Math.sqrt( sum );
  }
  
  export default class Node {
    constructor(Position) {
      this.Position = Position;
      this.Traversable = true;
      this.Closed = false;
      this.Path = false;
      this.GCost = Infinity;
      this.HCost = Infinity;
      this.FCost = Infinity; //(NodeA.FCost < NodeB.FCost)
      this.Neighbors = [];
  
      //Linked list
      this.Parent = null;
  
      //Heap
      this.n = null;
      this.P = null;
      this.L = null;
      this.R = null;
    }
    
    clone() {
      return clone(this);
    }
  
    GetNeighbors(maxX, maxY){
      var Neighbors = [];
  
      for(let i = 0; i < 3; ++i){
        for(let j = 0; j < 3; ++j){
              let x = (this.Position[0] + i - 1);
              let y = (this.Position[1] + j - 1);
  
              if ( !(this.Position[0] === x && this.Position[1] === y) && x >= 0 && x <= maxX && y >= 0 && y <= maxY){
                  Neighbors.push([x, y]);
              }
        }
      }
      return Neighbors
    }
  
    CalcG(GCost){
      //If the node has a parent, assign the parent's position to ParentVector
      var ParentVector = this.Parent ? this.Parent.Position : null;
  
      if (ParentVector){
          //Distance from current node to its Parent node
          let i = 0;
          GCost += Magnitude(this.Position.map( (x) => x - ParentVector[i++] ))
  
          //Repeat process for the parent node
          return this.Parent.CalcG(GCost)
      }
      return GCost
    }
  
    CalcH(target){
      let i = 0;
      return Magnitude(this.Position.map( (x) => x - target.Position[i++] ))
    }
  
    Trace(){
      this.Path = true;
      if(this.Parent)
        this.Parent.Trace()
    }
  }
  