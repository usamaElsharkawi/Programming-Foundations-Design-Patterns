// ============================================================
// Strategy interfaces (the contracts)
// ============================================================
// These are the supertypes. Concrete behaviors will implement them.
// The Duck class will hold references typed as these interfaces
// (program to an interface, not an implementation).
// ============================================================

export interface FlyBehavior {
  fly(): void;
}

export interface QuackBehavior {
  quack(): void;
}
