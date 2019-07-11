﻿/*
*  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';

/**
 * The ResizeMultipleTool class lets the user resize multiple objects at once.
 *
 * If you want to experiment with this extension, try the <a href="../../extensionsTS/ResizeMultiple.html">Resize Multiple</a> sample.
 * @category Tool Extension
 */
export class ResizeMultipleTool extends go.ResizingTool {
  /**
   * Constructs a ResizeMultipleTool and sets the name for the tool.
   */
  constructor() {
    super();
    this.name = 'ResizeMultiple';
  }

  /**
   * Overrides {@link ResizingTool#resize} to resize all selected objects to the same size.
   * @param {Rect} newr the intended new rectangular bounds for each Part's {@link Part#resizeObject}.
   */
  public resize(newr: go.Rect): void {
    const diagram = this.diagram;
    diagram.selection.each(function(part) {
      if (part instanceof go.Link || part instanceof go.Group) return; // only Nodes and simple Parts
      const obj = part.resizeObject;

      // calculate new location
      const pos = part.position.copy();
      const angle = obj.getDocumentAngle();
      const sc = obj.getDocumentScale();

      const radAngle = Math.PI * angle / 180;
      const angleCos = Math.cos(radAngle);
      const angleSin = Math.sin(radAngle);

      const deltaWidth = newr.width - obj.naturalBounds.width;
      const deltaHeight = newr.height - obj.naturalBounds.height;

      const angleRight = (angle > 270 || angle < 90) ? 1 : 0;
      const angleBottom = (angle > 0 && angle < 180) ? 1 : 0;
      const angleLeft = (angle > 90 && angle < 270) ? 1 : 0;
      const angleTop = (angle > 180 && angle < 360) ? 1 : 0;

      pos.x += sc * ((newr.x + deltaWidth * angleLeft) * angleCos - (newr.y + deltaHeight * angleBottom) * angleSin);
      pos.y += sc * ((newr.x + deltaWidth * angleTop) * angleSin + (newr.y + deltaHeight * angleLeft) * angleCos);

      obj.desiredSize = newr.size;
      part.position = pos;
    });
  }

}
