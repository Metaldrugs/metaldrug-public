// fdc-validator.js

/**
 * Functional Drug Complex (FDC) Validator
 * Parses and validates blueprint data input for logical structure,
 * keyword validity, and field completeness.
 * Tier 1 logic layer (client-side validation)
 */

export function validateFDCBlueprint(blueprint) {
  const errors = [];

  // Required fields for all FDC blueprints
  const requiredFields = [
    'name',
    'ligand_type',
    'functional_groups',
    'target_protein',
    'delivery_method',
    'simulation_mode'
  ];

  // Check for presence of required fields
  requiredFields.forEach(field => {
    if (!blueprint[field] || blueprint[field].toString().trim() === '') {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Check ligand_type
  const validLigandTypes = ['peptide', 'aptamer', 'rna', 'hybrid', 'custom'];
  if (!validLigandTypes.includes(blueprint.ligand_type)) {
    errors.push(`Invalid ligand type: ${blueprint.ligand_type}`);
  }

  // Validate functional_groups is an array
  if (!Array.isArray(blueprint.functional_groups) || blueprint.functional_groups.length === 0) {
    errors.push('Functional groups must be a non-empty array');
  }

  // Check delivery method
  const validDelivery = ['liposome', 'exosome', 'viral vector', 'nanobody'];
  if (!validDelivery.includes(blueprint.delivery_method)) {
    errors.push(`Unrecognized delivery method: ${blueprint.delivery_method}`);
  }

  // Simulation mode check
  const validSimModes = ['in_vitro', 'in_vivo', 'in_silico'];
  if (!validSimModes.includes(blueprint.simulation_mode)) {
    errors.push(`Unsupported simulation mode: ${blueprint.simulation_mode}`);
  }

  return errors;
}
