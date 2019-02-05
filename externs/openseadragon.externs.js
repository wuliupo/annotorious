/**
 * OpenSeadragon externs definition.
 */
var OpenSeadragon = {

  /** Adds an event handler to OpenSeadragon **/
  addHandler: function() {},

  /** The drawer **/  
  drawer: {
	  
	/** Adds an overlay **/
    addOverlay: function() {},
    
    /** Removes overlay **/
    removeOverlay: function() {}

  },
 
  /** The DOM element OpenSeadragon attaches to **/
  element: {}, 

  /** OpenSeadragon.Point class **/
  Point: function() {},

  /** OpenSeadragon.Rect class **/  
  Rect: function() {},
  
  /** The viewport **/
  Viewport: {
	  
  	/** Function to convert from browser window to OpenSeadragon coordinates **/
    windowToViewportCoordinates: function() {}, 
    
    /** Function to convert from OpenSeadragon to browser window coordinates **/
    viewportToWindowCoordinates: function() {}
    
  },
  
  Viewer: { 
    
    isFullPage: function() {}
    
  }
    
}

