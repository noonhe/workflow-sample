import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, AfterViewInit } from '@angular/core';
import * as go from 'gojs';
import { GuidedDraggingTool } from './gojs-tools/GuidedDraggingTool';
import { LinkLabelDraggingTool } from './gojs-tools/LinkLabelDraggingTool';
import { ResizeMultipleTool } from './gojs-tools/ResizeMultipleTool';
import { OrthogonalLinkReshapingTool } from './gojs-tools/OrthogonalLinkReshapingTool' ;
import { MatDialog } from '@angular/material';
import { ModalComponent } from './modal/modal.component';
import * as blankModel from './diagram-model/blank-model.json';

export interface DialogData {
  name: string,
  permissionsObj: PermissionObj
}
export interface PermissionObj {
  review: any,
  notif: any
}

@Component({
  selector: 'workflow-designer',
  templateUrl: './workflow-designer.component.html',
  styleUrls: ['./workflow-designer.component.css']
})
export class WorkflowDesignerComponent implements OnInit, OnChanges, AfterViewInit {

  private diagram: go.Diagram;
  private palette: go.Palette;
  @ViewChild('diagramDiv',{static:true}) diagramDiv: ElementRef;
  @ViewChild('paletteDiv',{static:true}) paletteDiv: ElementRef;
  model: any;
  workflowID: string = null;
  currentNode:go.Node;
  $ = go.GraphObject.make
  constructor(
    private modal: MatDialog,
  ) {

    this.model = blankModel;
    
    const $ = go.GraphObject.make;
    this.diagram = new go.Diagram();
    this.diagram.undoManager.isEnabled = true;
    this.diagram.toolManager.draggingTool = new GuidedDraggingTool();
    this.diagram.toolManager.resizingTool = new ResizeMultipleTool();
    this.diagram.toolManager.mouseMoveTools.insertAt(0, new LinkLabelDraggingTool());
    this.diagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
    this.diagram.initialAutoScale = go.Diagram.Uniform;
    this.diagram.toolManager.linkReshapingTool = new OrthogonalLinkReshapingTool();

    this.diagram.addDiagramListener("SelectionDeleting", (e) => {
      let part = e.subject.first();
      if (part.jb.stateId) {
        part.isSelected = false;
      }
    });

    this.diagram.addDiagramListener("LinkDrawn",(e)=>{
      let link = e.subject;
      if(link.fromNode.data.category==="Conditional"){
        console.log(link.data);
        console.log(link.portId, link.fromPortId);
      }
    })

    let defaultAdornment =
      $(go.Adornment, 'Spot',
        $(go.Panel, 'Auto',
          $(go.Shape, { fill: null, stroke: null, strokeWidth: 2 }),
          $(go.Placeholder)
        ),

        $('Button',
          {
            alignment: go.Spot.TopRight,
            click: this.addNodeAndLink
          },
          $(go.Shape, 'PlusLine', { desiredSize: new go.Size(6, 6) })
        )
      );

    //Process Nodes
    this.diagram.nodeTemplateMap.add("WaitingForReview",
      $(go.Node, "Table",this.nodeStyle(),
        {
          deletable: true,
          selectionAdorned: true,
          selectionAdornmentTemplate: defaultAdornment,
          resizable: true,
          doubleClick: (e, node: go.Node) => { this.openModal(node.data, node); }
        },
        
        // new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, "Auto",
        $(go.Shape, "RoundedRectangle",
          {
            fill: "#00A9C9",
            minSize: new go.Size(90, 60),
            strokeWidth: 0,
            // portId:"",
            // toLinkable: true,
            // toMaxLinks:1,
          },
          // new go.Binding("figure","figure")
          
          ),
        $(go.TextBlock, "WaitingForReview", this.textStyle(),
          {
            maxSize: new go.Size(160, NaN),
            editable: true,
            textAlign: "center",
            wrap: go.TextBlock.WrapFit
          },
          new go.Binding("text").makeTwoWay()),
      ),
      this.makePort("T", go.Spot.Top, go.Spot.TopSide,false, true),
      this.makePort("L", go.Spot.Left, go.Spot.LeftSide,true, true),
      this.makePort("R", go.Spot.Right, go.Spot.RightSide,true, true),
      this.makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false),
      ));
    //conditional Node
    this.diagram.nodeTemplateMap.add("Conditional",
      $(go.Node,
        'Auto',
        {
          resizable: true,
          deletable: true,
          doubleClick: (e, node: go.Node) => { this.openModal(node.data, node); },
        },
        this.nodeStyle(),
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Point.stringify),
        $(go.Panel, 'Auto',
          $(go.Shape, "Diamond",
            {
              fill: "rgb(255, 232, 105)",
              minSize: new go.Size(60, 60),
              strokeWidth: 0,
              stroke: null,
              // cursor: "pointer",
            },
            // new go.Binding("figure","figure")
            ),
          $(go.TextBlock,
            this.textStyle2(),
            {
              minSize: new go.Size(80, 20),
              editable: true,
              textAlign: "center",
              wrap: go.TextBlock.WrapFit
            },
            new go.Binding("text").makeTwoWay()),
        ),
        this.makePort("T", go.Spot.Top, go.Spot.Top, false, true),
        this.makePort("L", go.Spot.Left, go.Spot.Left, true, false),
        this.makePort("R", go.Spot.Right, go.Spot.Right, true, false),
      ));

    this.diagram.nodeTemplateMap.add("StartState",
      $(go.Node, 
        "Table",
        this.nodeStyle(),
        {
          deletable: false
        },
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            {
              minSize: new go.Size(60, 60),
              fill: "#79C900",
              strokeWidth: 0,
              stroke: null,
              // fromLinkable:true,
              // fromMaxLinks:1,
              // portId:"",
              // fromSpot:go.Spot.Bottom,
              // cursor: "pointer"
            }
          ),
          $(go.TextBlock, "StartState", this.textStyle(),
            {
              textAlign: "center"
            },
            new go.Binding("text")
           )
        ),
        this.makePort("B",go.Spot.Bottom,go.Spot.Bottom,true,false,0,1), 

      ));

    this.diagram.nodeTemplateMap.add("End",
      $(go.Node, "Table",
        this.nodeStyle(),
        {
          deletable: true
        },
        $(go.Panel, "Auto",
        $(go.Shape, "Circle",
          {
            minSize: new go.Size(60, 60),
            fill: "#e87a2c",
            strokeWidth: 0,
            stroke: null,
            portId:"",
            toLinkable: true,
            toMaxLinks:1,
            toSpot: go.Spot.Top,
            cursor: "pointer"
          }),
        $(go.TextBlock, "End", this.textStyle(),
          new go.Binding("text"))
      ),
      this.makePort("endTop",go.Spot.Top, go.Spot.Top, false, true,1,0 )
      ));

    this.diagram.nodeTemplateMap.add("Approved",
      $(go.Node, "Table",
        {
          deletable: true,
          doubleClick: (e, node: go.Node) => { this.openModal(node.data, node); }
        },
        this.nodeStyle(),
        $(go.Panel, "Auto",
        $(go.Shape, "Circle",
          {
            minSize: new go.Size(40, 40),
            fill: "#065b20",
            strokeWidth: 0,
            stroke: null,
            portId: "",
            toLinkable: true,
            fromLinkable: true,
            fromMaxLinks: 1,
            cursor: "pointer"
          }),
        $(go.TextBlock, "Approved", this.textStyle(),
          new go.Binding("text"))
      )) );
    this.diagram.nodeTemplateMap.add("Rejected",
      $(go.Node, "Auto",
        {
          doubleClick: (e, node: go.Node) => { this.openModal(node.data, node); },
          deletable: true
        },
        this.nodeStyle(),

        $(go.Shape, "Circle",
          {
            minSize: new go.Size(40, 40),
            fill: "#DC3C00",
            strokeWidth: 0,
            stroke: null,
            portId: "",
            toLinkable: true,
            fromLinkable: true,
            fromMaxLinks: 1,
            cursor: "pointer"

          }),
        $(go.TextBlock, "Rejected", this.textStyle(),
          new go.Binding("text"))
      ));

    this.diagram.linkTemplate =
      $(go.Link,
        {
          curve: go.Link.Bezier,
          curviness:1,
          reshapable: true,
          deletable:true,
        },
        $(go.Shape,
          { isPanelMain: true, stroke: "transparent", strokeWidth: 8 }
        ),
        $(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
        $(go.Shape,
          { toArrow: "standard", strokeWidth: 0, fill: "gray" }),
        $(go.Panel, "Auto",
          { visible: true, cursor: "move", name: "LABEL", segmentIndex:2, segmentFraction:0.5 },
          new go.Binding("visible", "visible").makeTwoWay(),
          $(go.Shape, "RoundedRectangle",
            { fill: "#F8F8F8", strokeWidth: 0 }),
          $(go.TextBlock, "تایید",
            {
              textAlign: "center",
              font: "11pt IRANSans, helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("text","fromPortId", (p)=>{
              console.log(p)
              return "yes"
            }).ofObject(),
            new go.Binding("text").makeTwoWay()),
        ));
    this.palette = new go.Palette();
    this.palette.fixedBounds = new go.Rect(-60, -100, 106, 350);

    this.palette.add(
      $(go.Part,
        { layerName: "Grid", position: this.palette.fixedBounds.position },
        $(go.Shape, { fill: "white", strokeWidth: 0, desiredSize: this.palette.fixedBounds.size })
      ));



    ///////////////////////////////////////////////////////////////////////////////////////
    this.palette.nodeTemplateMap.add("WaitingForReview",
      $(go.Node, "Auto",
        this.nodeStyle(),
        $(go.Shape, "RoundedRectangle",
          {
            fill: "#00A9C9",
            minSize: new go.Size(60, 40),
            strokeWidth: 0,
            stroke: null,
          }),
        $(go.TextBlock,
          this.textStyle(),
          new go.Binding("text", "text"))
      )
    );
    this.palette.nodeTemplateMap.add("Conditional",
      $(go.Node, 'Auto',
        this.nodeStyle(),
        $(go.Shape, "Diamond",
          {
            fill: "rgb(255, 232, 105)",
            minSize: new go.Size(60, 60),
            strokeWidth: 0,
            stroke: null,
          }),
        $(go.TextBlock,
          this.textStyle2(),
          new go.Binding("text", "text").makeTwoWay()),
      ));
    this.palette.nodeTemplateMap.add("StartState",
      $(go.Node,
        "Auto",
        this.nodeStyle(),
        $(go.Shape, "Circle",
          {
            minSize: new go.Size(40, 40),
            fill: "#79C900",
            strokeWidth: 0,
            stroke: null,
          }),
        $(go.TextBlock, "StartState", this.textStyle(),
          new go.Binding("text"))
      ));

    this.palette.nodeTemplateMap.add("End",
      $(go.Node, "Auto",
        this.nodeStyle(),
        $(go.Shape, "Circle",
          {
            minSize: new go.Size(40, 40),
            fill: "#e87a2c",
            strokeWidth: 0,
            stroke: null,
          }),
        $(go.TextBlock, "End", this.textStyle(),
          new go.Binding("text"))
      ));

    this.palette.nodeTemplateMap.add("Approved",
      $(go.Node, "Auto",
        this.nodeStyle(),
        $(go.Shape, "Circle",
          {
            minSize: new go.Size(40, 40),
            fill: "#065b20",
            strokeWidth: 0,
            stroke: null,
          }),
        $(go.TextBlock, "Approved", this.textStyle(),
          new go.Binding("text"))
      ));
    this.palette.nodeTemplateMap.add("Rejected",
      $(go.Node, "Auto",
        this.nodeStyle(),
        $(go.Shape, "Circle",
          {
            minSize: new go.Size(40, 40),
            fill: "#DC3C00",
            strokeWidth: 0,
            stroke: null,
          }),
        $(go.TextBlock, "Rejected", this.textStyle(),
          new go.Binding("text"))
      ));

    ///////////////////////////////////////////////////////////////////////////////////////

    this.palette.model = new go.GraphLinksModel([
      { category: 'StartState', text: 'شروع' },
      { category: 'WaitingForReview', text: 'عملیات' },
      { category: 'Conditional', text: 'شرط' },
      { category: "Approved", text: 'تایید' },
      { category: "Rejected", text: 'رد' },
      { category: "End", text: 'پایان', },
    ])
  }

  makePort(name: string, align: go.Spot, spot: go.Spot, output: boolean, input: boolean,toMax?:number , fromMax?:number) {
    const horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
    return this.$(go.Shape, {
      fill: "transparent",
      strokeWidth: 0,
      width: horizontal ? NaN : 8,
      height: !horizontal ? NaN : 8,
      alignment: align,
      stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
      portId: name,
      fromSpot: spot,
      fromLinkable: output,
      toSpot: spot,
      toLinkable: input,
      cursor: "pointer",
      toMaxLinks:toMax? toMax : NaN ,
      fromMaxLinks:fromMax? fromMax : NaN,
      mouseEnter: function (e, port) {
        if (!e.diagram.isReadOnly && port instanceof go.Shape) {
          if (align.equals(go.Spot.Left)) {
            port.fill = "rgba(255, 0, 0, 0.335)"
          }
          else if (align.equals(go.Spot.Right)) {
            port.fill = "rgba(21, 255, 0, 0.335)"
          }
          else {
            port.fill = "blue";
          }
        }
      },
      mouseLeave: function (e, port) {
        if (port instanceof go.Shape)
          port.fill = "transparent";
      }
    });
  }

  textStyle() {
    return {
      font: "bold 11pt IRANSans, Helvetica, Arial, sans-serif",
      margin: 6,
      stroke: "white"
    }
  }
  textStyle2() {
    return {
      font: "bold 11pt IRANSans, Helvetica, Arial, sans-serif",
      margin: 6,
      stroke: "black"
    }
  }
  nodeStyle() {
    return [
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        locationSpot: go.Spot.Center
      }
    ];
  }

  portStyle(input) {
    return {
      width: 6,
      height: 6,
      fill: "lightgray",
      stroke: "black",
      strokeWidth: 1,
      fromLinkable: !input,
      toLinkable: input,
      cursor: "pointer"
    }
  }
  addNodeAndLink(e: go.InputEvent, obj: go.GraphObject) {
    const adorn = obj.part as go.Adornment;
    const fromNode = adorn.adornedPart;
    if (fromNode === null) return;
    e.handled = true;
    const diagram = e.diagram;
    diagram.startTransaction('Add State');
    const fromData = fromNode.data;
    const toData: any = { category: "WaitingForReview", text: 'عملیات' };
    const p = fromNode.location.copy();
    p.y += 200;
    toData.loc = go.Point.stringify(p);
    const model = diagram.model as go.GraphLinksModel;
    model.addNodeData(toData);
    const linkdata = {
      from: model.getKeyForNodeData(fromData),
      to: model.getKeyForNodeData(toData),
      text: 'تایید'
    };
    model.addLinkData(linkdata);
    const newnode = diagram.findNodeForData(toData);
    diagram.select(newnode);
    diagram.commitTransaction('Add State');
    diagram.scrollToRect(newnode.actualBounds);
  }



  ngOnInit() {
    this.diagram.div = this.diagramDiv.nativeElement;
    this.palette.div = this.paletteDiv.nativeElement;
    this.loadDiagram()
  }
  ngOnChanges() {

    this.loadDiagram();
  }

  ngAfterViewInit() {
  }

  saveDiagram() {
    let newModel = this.diagram.model.toJson();
    console.log(newModel)

  }

  loadDiagram() {
    console.log(blankModel)
    this.diagram.model = go.Model.fromJson(this.model.default);
  }

  refreshDiagramLayout() {
    this.diagram.layoutDiagram(true);
  }

  openModal(nodeData, node) {
    this.currentNode=node;
    const modalRef = this.modal.open(ModalComponent, {
      width: '450px',
      height: '500px',
      data: {
        text: nodeData.text,
        permissionsObj: {
          review: null,
          notif: null
        },
        isConditional: (nodeData.category === 'Conditional')
      }
    })
    modalRef.afterClosed().subscribe(res => {
      console.log(res, nodeData)
      this.diagram.startTransaction();
      this.diagram.model.set(this.currentNode.data,"text",res.text);
      this.diagram.commitTransaction();
    })
  }
}


