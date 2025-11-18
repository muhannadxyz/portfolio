// Drag and Drop System
const DragDrop = (function() {
  let dragState = {
    isDragging: false,
    draggedElement: null,
    draggedData: null,
    ghostElement: null,
    startX: 0,
    startY: 0
  };
  
  let dropZones = new Map(); // dropZoneId -> handler
  
  function init() {
    // Prevent default browser drag behavior
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    
    document.addEventListener('drop', (e) => {
      e.preventDefault();
    });
  }
  
  function makeDraggable(element, data, options = {}) {
    element.draggable = true;
    element.style.cursor = 'grab';
    
    element.addEventListener('dragstart', (e) => {
      dragState.isDragging = true;
      dragState.draggedElement = element;
      dragState.draggedData = data;
      dragState.startX = e.clientX;
      dragState.startY = e.clientY;
      
      element.style.opacity = '0.5';
      element.style.cursor = 'grabbing';
      
      // Create ghost element
      if (options.ghostContent) {
        dragState.ghostElement = document.createElement('div');
        dragState.ghostElement.innerHTML = options.ghostContent;
        dragState.ghostElement.style.cssText = 'position: fixed; pointer-events: none; z-index: 10000; background: rgba(0, 255, 225, 0.2); border: 1px solid rgba(0, 255, 225, 0.5); border-radius: 6px; padding: 8px 12px; font-size: 13px; color: #00ffe1;';
        document.body.appendChild(dragState.ghostElement);
      }
      
      // Set drag data
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = options.effectAllowed || 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify(data));
      }
      
      if (options.onDragStart) {
        options.onDragStart(data, element);
      }
    });
    
    element.addEventListener('drag', (e) => {
      if (dragState.ghostElement && e.clientX > 0 && e.clientY > 0) {
        dragState.ghostElement.style.left = `${e.clientX + 10}px`;
        dragState.ghostElement.style.top = `${e.clientY + 10}px`;
      }
    });
    
    element.addEventListener('dragend', (e) => {
      element.style.opacity = '1';
      element.style.cursor = 'grab';
      
      // Remove ghost element
      if (dragState.ghostElement) {
        dragState.ghostElement.remove();
        dragState.ghostElement = null;
      }
      
      if (options.onDragEnd) {
        options.onDragEnd(data, element);
      }
      
      dragState.isDragging = false;
      dragState.draggedElement = null;
      dragState.draggedData = null;
    });
  }
  
  function makeDropZone(element, dropZoneId, handler) {
    dropZones.set(dropZoneId, handler);
    
    element.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!dragState.isDragging) return;
      
      // Highlight drop zone
      element.classList.add('drop-zone-active');
      element.style.background = 'rgba(0, 255, 225, 0.1)';
      element.style.border = '2px dashed rgba(0, 255, 225, 0.5)';
      
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    });
    
    element.addEventListener('dragleave', (e) => {
      // Remove highlight
      element.classList.remove('drop-zone-active');
      element.style.background = '';
      element.style.border = '';
    });
    
    element.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Remove highlight
      element.classList.remove('drop-zone-active');
      element.style.background = '';
      element.style.border = '';
      
      if (!dragState.isDragging) return;
      
      let data = dragState.draggedData;
      
      // Try to get data from dataTransfer if not available
      if (!data && e.dataTransfer) {
        try {
          const jsonData = e.dataTransfer.getData('text/plain');
          data = JSON.parse(jsonData);
        } catch (err) {
          console.error('Error parsing drop data:', err);
        }
      }
      
      // Call handler
      const handler = dropZones.get(dropZoneId);
      if (handler && data) {
        handler(data, element, e);
      }
    });
  }
  
  function isDragging() {
    return dragState.isDragging;
  }
  
  function getDraggedData() {
    return dragState.draggedData;
  }
  
  function removeDraggable(element) {
    element.draggable = false;
    element.style.cursor = '';
    // Remove all drag event listeners (simplified - in production use AbortController)
  }
  
  function removeDropZone(element, dropZoneId) {
    dropZones.delete(dropZoneId);
    // Remove all drop event listeners (simplified)
  }
  
  return {
    init,
    makeDraggable,
    makeDropZone,
    isDragging,
    getDraggedData,
    removeDraggable,
    removeDropZone
  };
})();

window.DragDrop = DragDrop;

