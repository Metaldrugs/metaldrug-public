# fdc_simulator.py
# Simulates Functional Drug Complex (FDC) behavior under different physiological conditions

class FDCEnvironment:
    def __init__(self, pH: float, temperature_c: float, oxidative_stress: float):
        self.pH = pH
        self.temperature_c = temperature_c
        self.oxidative_stress = oxidative_stress  # 0.0 (none) to 1.0 (extreme)

    def profile(self):
        return {
            "pH": self.pH,
            "temperature_c": self.temperature_c,
            "oxidative_stress": self.oxidative_stress
        }


class FDC:
    def __init__(self, name: str, base_activity: float):
        self.name = name
        self.base_activity = base_activity  # Arbitrary unit (AU)

    def simulate_behavior(self, environment: FDCEnvironment) -> dict:
        pH_effect = max(0.1, 1 - abs(7.4 - environment.pH) * 0.15)
        temp_effect = max(0.1, 1 - abs(37 - environment.temperature_c) * 0.05)
        stress_effect = 1 - environment.oxidative_stress * 0.3

        net_activity = self.base_activity * pH_effect * temp_effect * stress_effect

        return {
            "name": self.name,
            "base_activity": self.base_activity,
            "adjusted_activity": round(net_activity, 4),
            "modifiers": {
                "pH_effect": round(pH_effect, 3),
                "temp_effect": round(temp_effect, 3),
                "stress_effect": round(stress_effect, 3)
            },
            "environment": environment.profile()
        }


# Sample usage for internal testing
if __name__ == "__main__":
    env = FDCEnvironment(pH=6.8, temperature_c=39, oxidative_stress=0.4)
    compound = FDC(name="FDC-101", base_activity=100)
    result = compound.simulate_behavior(env)

    import json
    print(json.dumps(result, indent=2))
