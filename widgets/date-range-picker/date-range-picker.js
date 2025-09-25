function DateRangePickerController($scope) {
  'use strict';
  
  var ctrl = this;
  
  // Initialize controller
  ctrl.init = function() {
    // Initialize dates from properties
    if ($scope.properties.startDate) {
      ctrl.startDate = ctrl.parseDate($scope.properties.startDate);
    }
    if ($scope.properties.endDate) {
      ctrl.endDate = ctrl.parseDate($scope.properties.endDate);
    }
    
    // Watch for external changes to the bound variables
    $scope.$watch('properties.startDate', function(newVal) {
      if (newVal && newVal !== ctrl.formatDateForModel(ctrl.startDate)) {
        ctrl.startDate = ctrl.parseDate(newVal);
      }
    });
    
    $scope.$watch('properties.endDate', function(newVal) {
      if (newVal && newVal !== ctrl.formatDateForModel(ctrl.endDate)) {
        ctrl.endDate = ctrl.parseDate(newVal);
      }
    });
  };
  
  // Parse date from string
  ctrl.parseDate = function(dateString) {
    if (!dateString) return null;
    
    var date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };
  
  // Format date for display based on the selected format
  ctrl.formatDate = function(date) {
    if (!date) return '';
    
    var format = $scope.properties.dateFormat || 'yyyy-MM-dd';
    var d = new Date(date);
    
    var day = ('0' + d.getDate()).slice(-2);
    var month = ('0' + (d.getMonth() + 1)).slice(-2);
    var year = d.getFullYear();
    
    switch (format) {
      case 'dd/MM/yyyy':
        return day + '/' + month + '/' + year;
      case 'MM/dd/yyyy':
        return month + '/' + day + '/' + year;
      case 'dd-MM-yyyy':
        return day + '-' + month + '-' + year;
      default:
        return year + '-' + month + '-' + day;
    }
  };
  
  // Format date for model (always ISO format)
  ctrl.formatDateForModel = function(date) {
    if (!date) return null;
    
    var d = new Date(date);
    var month = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    var year = d.getFullYear();
    
    return year + '-' + month + '-' + day;
  };
  
  // Update the bound variables when dates change
  ctrl.updateDateRange = function() {
    $scope.properties.startDate = ctrl.formatDateForModel(ctrl.startDate);
    $scope.properties.endDate = ctrl.formatDateForModel(ctrl.endDate);
    
    // Validate date range
    if (ctrl.startDate && ctrl.endDate && ctrl.startDate > ctrl.endDate) {
      // Swap dates if start date is after end date
      var temp = ctrl.startDate;
      ctrl.startDate = ctrl.endDate;
      ctrl.endDate = temp;
      
      $scope.properties.startDate = ctrl.formatDateForModel(ctrl.startDate);
      $scope.properties.endDate = ctrl.formatDateForModel(ctrl.endDate);
    }
  };
  
  // Clear both dates
  ctrl.clearDates = function() {
    ctrl.startDate = null;
    ctrl.endDate = null;
    $scope.properties.startDate = null;
    $scope.properties.endDate = null;
  };
  
  // Calculate duration between dates
  ctrl.getDuration = function() {
    if (!ctrl.startDate || !ctrl.endDate) return 0;
    
    var timeDiff = Math.abs(new Date(ctrl.endDate).getTime() - new Date(ctrl.startDate).getTime());
    var dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end date
    
    return dayDiff;
  };
  
  // Quick selection methods
  ctrl.selectLastWeek = function() {
    var today = new Date();
    var lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    
    ctrl.startDate = lastWeek;
    ctrl.endDate = today;
    ctrl.updateDateRange();
  };
  
  ctrl.selectLastMonth = function() {
    var today = new Date();
    var lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);
    
    ctrl.startDate = lastMonth;
    ctrl.endDate = today;
    ctrl.updateDateRange();
  };
  
  ctrl.selectThisMonth = function() {
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    ctrl.startDate = firstDay;
    ctrl.endDate = today;
    ctrl.updateDateRange();
  };
  
  ctrl.selectLastThreeMonths = function() {
    var today = new Date();
    var threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    ctrl.startDate = threeMonthsAgo;
    ctrl.endDate = today;
    ctrl.updateDateRange();
  };
  
  // Initialize the controller
  ctrl.init();
}

// Register the controller
angular.module('bonitasoft.ui.widgets')
  .controller('DateRangePickerController', DateRangePickerController);