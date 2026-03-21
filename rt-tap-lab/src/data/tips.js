(function() {
  const RTL = window.RTTapLab;

  RTL.TIPS = [
    'Normal SpO₂ is 95-100%. Below 90% is critical!',
    'PEEP helps keep alveoli open and improves oxygenation.',
    'Suctioning should be limited to 10-15 seconds at a time.',
    'Bronchodilators relax airway smooth muscle to ease breathing.',
    'COPD patients may have a baseline SpO₂ of 88-92%.',
    'High-flow nasal cannula can deliver up to 60 L/min of O₂.',
    'Asthma attacks cause bronchospasm and airway inflammation.',
    'Pneumonia fills alveoli with fluid, reducing gas exchange.',
    'Positive pressure ventilation helps recruit collapsed alveoli.',
    'Secretion clearance is essential for maintaining open airways.',
    'Peak inspiratory pressure should typically stay below 30 cmH₂O.',
    'Respiratory rate of 12-20 breaths/min is normal for adults.',
    'ABG analysis helps assess ventilation and oxygenation status.',
    'Nebulized medications are delivered as a fine mist to the lungs.',
    'Chest physiotherapy helps mobilize and clear secretions.',
    'Ventilator-associated pneumonia is a common ICU complication.',
    'Pulse oximetry measures peripheral oxygen saturation.',
    'Incentive spirometry encourages deep breathing post-surgery.',
    'BiPAP provides two levels of pressure for breathing support.',
    'The diaphragm is the primary muscle of respiration.'
  ];

  RTL.getRandomTip = function() {
    return RTL.TIPS[Math.floor(Math.random() * RTL.TIPS.length)];
  };
})();
