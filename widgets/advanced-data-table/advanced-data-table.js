function AdvancedDataTableController($scope) {
  'use strict';
  
  var ctrl = this;
  
  // Initialize controller
  ctrl.init = function() {
    ctrl.originalData = [];
    ctrl.filteredData = [];
    ctrl.currentPage = 1;
    ctrl.itemsPerPage = $scope.properties.itemsPerPage || 10;
    ctrl.searchQuery = '';
    ctrl.sortColumn = null;
    ctrl.sortReverse = false;
    ctrl.selectAll = false;
    
    // Watch for data changes
    $scope.$watch('properties.dataSource', function(newData) {
      ctrl.loadData(newData);
    }, true);
    
    // Watch for column changes
    $scope.$watch('properties.columns', function(newColumns) {
      ctrl.columns = newColumns || [];
    }, true);
    
    // Initialize data
    ctrl.loadData($scope.properties.dataSource);
    ctrl.columns = $scope.properties.columns || [];
  };
  
  // Load and prepare data
  ctrl.loadData = function(data) {
    ctrl.originalData = angular.copy(data) || [];
    ctrl.applyFilters();
  };
  
  // Get columns configuration
  ctrl.getColumns = function() {
    return ctrl.columns || [];
  };
  
  // Apply search and filters
  ctrl.applyFilters = function() {
    ctrl.filteredData = ctrl.originalData.filter(function(item) {
      if (!ctrl.searchQuery) return true;
      
      var query = ctrl.searchQuery.toLowerCase();
      return ctrl.getColumns().some(function(column) {
        var value = item[column.key];
        if (value == null) return false;
        return value.toString().toLowerCase().indexOf(query) !== -1;
      });
    });
    
    ctrl.applySorting();
    ctrl.currentPage = 1; // Reset to first page after filtering
    ctrl.updateSelectAll();
  };
  
  // Apply sorting
  ctrl.applySorting = function() {
    if (!ctrl.sortColumn) return;
    
    ctrl.filteredData.sort(function(a, b) {
      var aVal = a[ctrl.sortColumn];
      var bVal = b[ctrl.sortColumn];
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return ctrl.sortReverse ? -1 : 1;
      if (bVal == null) return ctrl.sortReverse ? 1 : -1;
      
      // Type-specific comparison
      var column = ctrl.getColumns().find(function(col) { return col.key === ctrl.sortColumn; });
      if (column && (column.type === 'number' || column.type === 'currency')) {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else if (column && column.type === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }
      
      var result = aVal < bVal ? -1 : (aVal > bVal ? 1 : 0);
      return ctrl.sortReverse ? -result : result;
    });
  };
  
  // Sort by column
  ctrl.sort = function(column) {
    if (ctrl.sortColumn === column) {
      ctrl.sortReverse = !ctrl.sortReverse;
    } else {
      ctrl.sortColumn = column;
      ctrl.sortReverse = false;
    }
    ctrl.applySorting();
  };
  
  // Pagination methods
  ctrl.getPaginatedData = function() {
    var start = (ctrl.currentPage - 1) * ctrl.itemsPerPage;
    var end = start + ctrl.itemsPerPage;
    return ctrl.filteredData.slice(start, end);
  };
  
  ctrl.getTotalPages = function() {
    return Math.ceil(ctrl.filteredData.length / ctrl.itemsPerPage);
  };
  
  ctrl.goToPage = function(page) {
    if (page >= 1 && page <= ctrl.getTotalPages()) {
      ctrl.currentPage = page;
    }
  };
  
  ctrl.previousPage = function() {
    ctrl.goToPage(ctrl.currentPage - 1);
  };
  
  ctrl.nextPage = function() {
    ctrl.goToPage(ctrl.currentPage + 1);
  };
  
  ctrl.getPageNumbers = function() {
    var totalPages = ctrl.getTotalPages();
    var current = ctrl.currentPage;
    var pages = [];
    
    var start = Math.max(1, current - 2);
    var end = Math.min(totalPages, current + 2);
    
    for (var i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  ctrl.updatePagination = function() {
    ctrl.currentPage = 1;
  };
  
  // Info methods
  ctrl.getPaginationStart = function() {
    return ctrl.filteredData.length === 0 ? 0 : (ctrl.currentPage - 1) * ctrl.itemsPerPage + 1;
  };
  
  ctrl.getPaginationEnd = function() {
    return Math.min(ctrl.currentPage * ctrl.itemsPerPage, ctrl.filteredData.length);
  };
  
  ctrl.getTotalItems = function() {
    return ctrl.filteredData.length;
  };
  
  ctrl.getRowNumber = function(index) {
    return (ctrl.currentPage - 1) * ctrl.itemsPerPage + index + 1;
  };
  
  ctrl.getTotalColumns = function() {
    var count = ctrl.getColumns().length;
    if ($scope.properties.enableSelection) count++;
    if ($scope.properties.showRowNumbers) count++;
    return count;
  };
  
  ctrl.isEmpty = function() {
    return !ctrl.filteredData || ctrl.filteredData.length === 0;
  };
  
  // Selection methods
  ctrl.toggleSelection = function(item) {
    item._selected = !item._selected;
    ctrl.updateSelectedItems();
    ctrl.updateSelectAll();
  };
  
  ctrl.toggleSelectAll = function() {
    var paginatedData = ctrl.getPaginatedData();
    paginatedData.forEach(function(item) {
      item._selected = ctrl.selectAll;
    });
    ctrl.updateSelectedItems();
  };
  
  ctrl.updateSelectAll = function() {
    var paginatedData = ctrl.getPaginatedData();
    if (paginatedData.length === 0) {
      ctrl.selectAll = false;
      return;
    }
    
    ctrl.selectAll = paginatedData.every(function(item) {
      return item._selected;
    });
  };
  
  ctrl.updateSelectedItems = function() {
    if (!$scope.properties.enableSelection) return;
    
    var selectedItems = ctrl.originalData.filter(function(item) {
      return item._selected;
    });
    
    $scope.properties.selectedItems = selectedItems;
  };
  
  ctrl.isSelected = function(item) {
    return item._selected === true;
  };
  
  ctrl.hasSelectedItems = function() {
    return ctrl.getSelectedCount() > 0;
  };
  
  ctrl.getSelectedCount = function() {
    return ctrl.originalData.filter(function(item) {
      return item._selected;
    }).length;
  };
  
  ctrl.clearSelection = function() {
    ctrl.originalData.forEach(function(item) {
      item._selected = false;
    });
    ctrl.selectAll = false;
    ctrl.updateSelectedItems();
  };
  
  // Formatting methods
  ctrl.formatDate = function(value) {
    if (!value) return '';
    var date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleDateString();
  };
  
  ctrl.formatCurrency = function(value) {
    if (value == null || isNaN(value)) return '';
    return '$' + parseFloat(value).toFixed(2);
  };
  
  ctrl.formatNumber = function(value) {
    if (value == null || isNaN(value)) return '';
    return parseFloat(value).toLocaleString();
  };
  
  // Export functionality
  ctrl.exportToCsv = function() {
    if (!ctrl.filteredData || ctrl.filteredData.length === 0) return;
    
    var columns = ctrl.getColumns();
    var csvContent = '';
    
    // Header row
    var headers = columns.map(function(col) { return col.label; });
    csvContent += headers.join(',') + '\n';
    
    // Data rows
    ctrl.filteredData.forEach(function(item) {
      var row = columns.map(function(col) {
        var value = item[col.key] || '';
        // Escape commas and quotes
        if (typeof value === 'string' && (value.indexOf(',') !== -1 || value.indexOf('"') !== -1)) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvContent += row.join(',') + '\n';
    });
    
    // Create and download file
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'table-export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Initialize the controller
  ctrl.init();
}

// Register the controller
angular.module('bonitasoft.ui.widgets')
  .controller('AdvancedDataTableController', AdvancedDataTableController);